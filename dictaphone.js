        $(document).ready(function() {
            let browserModal;
            const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            const isEdge = /Edg/.test(navigator.userAgent);

            // UI Elements
            const elements = {
                testBtn: $('#testBtn'),
                startBtn: $('#startBtn'),
                stopBtn: $('#stopBtn'),
                clearBtn: $('#clearBtn'),
                status: $('#status'),
                output: $('#output'),
                debugInfo: $('#debugInfo'),
                volumeMeter: $('#volumeMeter'),
                recordingIndicator: $('#recordingIndicator'),
                languageSelect: $('#languageSelect'),
                recordingText: $('.recording-text'),
                copyButton: $('#copyButton'),
                copyFeedback: $('#copyFeedback'),
                mainContent: $('#mainContent'),
                firefoxHelp: $('#firefoxHelp'),
                compatWarning: $('#compatWarning'),
                browserBadge: $('#browserBadge'),
                dictaphoneUI: $('#dictaphoneUI')
            };

            // State
            let state = {
                recognition: null,
                audioContext: null,
                microphone: null,
                audioStream: null,
                isRecording: false
            };

            function log(message) {
                const time = new Date().toLocaleTimeString();
                elements.debugInfo.append(`[${time}] ${message}<br>`);
                elements.debugInfo.scrollTop(elements.debugInfo[0].scrollHeight);
            }

            function showStatus(message, type = 'info') {
                elements.status.removeClass().addClass(`alert alert-${type}`).html(message);
            }

            async function testMicrophone() {
                try {
                    showStatus('Testing microphone access...', 'info');
                    
                    state.audioStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true
                        }
                    });

                    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    state.microphone = state.audioContext.createMediaStreamSource(state.audioStream);
                    
                    const analyzer = state.audioContext.createAnalyser();
                    analyzer.fftSize = 2048;
                    state.microphone.connect(analyzer);
                    
                    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
                    
                    function updateVolumeMeter() {
                        analyzer.getByteFrequencyData(dataArray);
                        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                        const volume = Math.min(100, average * 3);
                        
                        elements.volumeMeter.css('width', volume + '%')
                            .css('background-color', volume > 5 ? '#28a745' : '#dc3545');
                        
                        requestAnimationFrame(updateVolumeMeter);
                    }
                    
                    updateVolumeMeter();
                    showStatus('Microphone working! Speak to test', 'success');
                    log('Microphone test successful');
                    
                    elements.startBtn.show();
                    
                    initRecognition();
                    
                } catch (error) {
                    showStatus('Microphone error: ' + error.message, 'danger');
                    log('Microphone test failed: ' + error.message);
                }
            }

            function initRecognition() {
                try {
                    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    state.recognition = new window.SpeechRecognition();
                    
                    // Configure recognition
                    state.recognition.continuous = true;
                    state.recognition.interimResults = true;
                    state.recognition.maxAlternatives = 1;
                    state.recognition.lang = elements.languageSelect.val();

                    // Recognition event handlers
                    state.recognition.onstart = () => {
                        state.isRecording = true;
                        showStatus('Recording... Speak now', 'success');
                        elements.startBtn.hide();
                        elements.stopBtn.show();
                        elements.recordingIndicator.show();
                        log('Recognition started - Language: ' + state.recognition.lang);
                    };

                    state.recognition.onresult = (event) => {
                        let finalTranscript = '';
                        
                        for (let i = event.resultIndex; i < event.results.length; i++) {
                            const transcript = event.results[i][0].transcript;
                            const confidence = event.results[i][0].confidence;
                            
                            if (event.results[i].isFinal) {
                                finalTranscript += transcript + '\n';
                                log(`Final transcript received (${(confidence * 100).toFixed(1)}% confidence)`);
                            }
                        }

                        if (finalTranscript) {
                            elements.output.val(elements.output.val() + finalTranscript);
                            elements.copyButton.show();
                        }
                    };

                    state.recognition.onerror = (event) => {
                        log('Recognition error: ' + event.error);
                        if (event.error === 'no-speech') {
                            showStatus('No speech detected. Please speak louder.', 'warning');
                        } else {
                            showStatus('Error: ' + event.error, 'danger');
                        }
                    };

                    state.recognition.onend = () => {
                        if (state.isRecording) {
                            state.recognition.start();
                            log('Restarting recognition...');
                        } else {
                            elements.recordingIndicator.hide();
                            elements.startBtn.show();
                            elements.stopBtn.hide();
                            showStatus('Recording stopped', 'info');
                            log('Recognition ended');
                        }
                    };

                    log('Speech recognition ready');
                    return true;
                } catch (e) {
                    showStatus('Speech recognition not supported in this browser', 'danger');
                    return false;
                }
            }

            function checkBrowserSupport() {
                if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
                    elements.mainContent.show();
                    elements.dictaphoneUI.show();
                    elements.browserBadge.text(isChrome ? 'Chrome' : isEdge ? 'Edge' : 'Compatible Browser').show();
                    return true;
                } else {
                    elements.mainContent.show();
                    if (isFirefox) {
                        elements.firefoxHelp.show();
                        elements.browserBadge.text('Firefox').addClass('bg-warning').show();
                    }
                    elements.compatWarning.show();
                    browserModal = new bootstrap.Modal(document.getElementById('browserModal'));
                    browserModal.show();
                    return false;
                }
            }

            function showCopyFeedback(message, type = 'success') {
                elements.copyFeedback
                    .removeClass('bg-success bg-danger bg-warning')
                    .addClass(`bg-${type}`)
                    .html(`<i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i> ${message}`)
                    .css('display', 'block');

                setTimeout(() => {
                    elements.copyFeedback.css('display', 'none');
                }, 2000);
            }

            // Event Listeners
            elements.testBtn.click(testMicrophone);
            
            elements.startBtn.click(() => {
                try {
                    state.isRecording = true;
                    state.recognition.lang = elements.languageSelect.val();
                    state.recognition.start();
                } catch (e) {
                    log('Error starting recognition: ' + e.message);
                }
            });
            
            elements.stopBtn.click(() => {
                state.isRecording = false;
                state.recognition.stop();
                showStatus('Recording stopped', 'info');
                log('Recording stopped by user');
            });

            elements.clearBtn.click(() => {
                elements.output.val('');
                elements.copyButton.hide();
                showStatus('Text cleared', 'info');
                log('Transcript cleared');
            });

            elements.languageSelect.change(() => {
                if (state.recognition) {
                    const newLang = elements.languageSelect.val();
                    state.recognition.lang = newLang;
                    log('Language changed to: ' + newLang);
                }
            });

            elements.copyButton.click(async () => {
                try {
                    const text = elements.output.val();
                    if (!text) {
                        showCopyFeedback('No text to copy!', 'warning');
                        return;
                    }

                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(text);
                        showCopyFeedback('Text copied to clipboard!', 'success');
                    } else {
                        elements.output.select();
                        document.execCommand('copy');
                        showCopyFeedback('Text copied to clipboard!', 'success');
                    }
                } catch (err) {
                    console.error('Copy failed:', err);
                    showCopyFeedback('Copy failed. Please try again.', 'danger');
                }
            });

            $('#continueAnyway').click(function(e) {
                e.preventDefault();
                browserModal.hide();
            });

            // Initialize
            checkBrowserSupport();

            // Cleanup
            window.onbeforeunload = () => {
                if (state.audioStream) {
                    state.audioStream.getTracks().forEach(track => track.stop());
                }
                if (state.audioContext) {
                    state.audioContext.close();
                }
            };
        });