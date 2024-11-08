# Browser-based Dictaphone with Speech Recognition

A modern, responsive web application that converts speech to text using the Web Speech API. This application supports multiple languages and provides real-time transcription capabilities.

![Speech Recognition Demo](screenshots/demo.gif)

## 🎯 Features

- **Real-time Speech Recognition**
  - Converts spoken words to text instantly
  - Support for multiple languages (English, French, Spanish)
  - Visual feedback for audio input levels
  - Continuous recording capability

- **User-Friendly Interface**
  - Clean, modern design using Bootstrap 5
  - Responsive layout works on all devices
  - Dark mode support
  - Real-time microphone level visualization

- **Text Management**
  - Copy to clipboard functionality
  - Clear text option
  - Automatic text preservation
  - Easy text selection

- **Browser Support**
  - Full support for Chrome and Edge
  - Browser compatibility checks
  - Alternative suggestions for unsupported browsers
  - Firefox fallback options

- **Accessibility**
  - High contrast interface
  - Screen reader friendly
  - Keyboard navigation support
  - Clear visual feedback

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome or Edge recommended)
- Microphone access
- Web server (local or hosted)

### Installation
Just copy/paste the files on your server.

## 🎤 Usage

1. **Select Language**
   - Choose your preferred language from the dropdown menu
   - Supports English (US/UK), French, and Spanish

2. **Microphone Setup**
   - Click "Test Mic" to verify your microphone is working
   - Check the volume meter for audio input level

3. **Recording**
   - Click "Start Recording" to begin speech recognition
   - Speak clearly into your microphone
   - The text will appear in real-time in the text area

4. **Managing Text**
   - Use the copy button to copy the entire transcript
   - Clear button removes all text
   - Text is automatically preserved until cleared

## 💻 Technologies Used

- HTML5
- CSS3
- JavaScript
- jQuery 3.7.1
- Bootstrap 5.3.2
- Font Awesome 6.4.2
- Web Speech API

## 🌐 Browser Compatibility

### Fully Supported
- Google Chrome (latest)
- Microsoft Edge (latest)

### Limited Support
- Firefox (requires extensions)
- Safari (partial support)

### Known Limitations
- Speech recognition requires a secure context (HTTPS or localhost)
- Some browsers may require permissions to be granted manually
- Mobile browser support may vary

### File Structure
```
dictaphone/
├── index.html
├── dictaphone.css
├── dictaphone.js
└── README.md
```

### Customization
- Modify `dictaphone.css` for visual changes
- Update language options in the HTML select element
- Adjust recognition settings in JavaScript

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Web Speech API documentation and community
- Bootstrap team for the UI framework
- Font Awesome for the icons
- All contributors and testers

## 📧 Contact

Benoit Dausse - [bdausse@email.com](mailto:bdausse@email.com)

Project Link: [https://github.com/benoitdausse/dictaphone](https://github.com/benoitdausse/dictaphone)

---
Made with ❤️ by Bdausse
