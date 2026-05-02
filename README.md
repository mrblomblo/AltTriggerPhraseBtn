# Alternate Trigger Phrase Button

A [SwarmUI](https://github.com/mcmonkeyprojects/SwarmUI) extension that modifies the appearance of trigger phrase copy buttons to include the phrase text inside the button itself.

## Description

This fully AI-written extension changes how the trigger phrase copy buttons are displayed. Instead of showing the phrase text separately with a copy button next to it, the modified version integrates the phrase text directly into the button, creating a cleaner, more unified appearance.

I (Blomblo) have been using this since September 2025 without experiencing any issues or negative side-effects.

### Before
```
trigger phrase text [📋]
```

<img width="720" alt="image" src="https://github.com/user-attachments/assets/7678b988-3e7d-4927-ab03-a5f03562d26c" />

### After
```
[trigger phrase text 📋]
```

<img width="720" alt="image" src="https://github.com/user-attachments/assets/55c95df8-6e9a-49bb-a490-bf5bc3adbe2f" />

## Features

- Seamlessly overrides the default trigger phrase copy button creation
- Maintains all existing functionality (copy to clipboard, trailing comma option)
- Includes the phrase text directly in the button for a cleaner UI
- Allows selecting and copying parts of the trigger phrase without triggering a full copy
- Respects user settings for trailing comma preference

## Installation

1. Shutdown SwarmUI (Navigate to the Server tab and press "Shutdown Server")
2. Open the terminal in the Extensions folder SwarmUI/src/Extensions/
3. Copy and paste the following into the terminal and press enter:
   
   ```bash
   git clone https://github.com/mrblomblo/AltTriggerPhraseBtn.git
   ```
   
5. Run the dev launch script for your OS. Once it has launched, you can shut it down and run SwarmUI with the regular launch script

## License

MIT License

## Author

Blomblo

## Support

For issues or questions, please open an issue.
