const { exec } = require("child_process");
const { promisify } = require("util");
const fs = require("fs");

const execAsync = promisify(exec);

// Function to escape text for PowerShell
function escapeForPowerShell(text) {
  return text
    .replace(/'/g, "''") // Escape single quotes
    .replace(/’/g, "''") // Escape single quotes
    .replace(/‘/g, "''") // Escape single quotes
    .replace(/"/g, '`"') // Escape double quotes
    .replace(/“/g, '`"') // Escape double quotes
    .replace(/”/g, '`"') // Escape double quotes
    .replace(/`/g, "``") // Escape backticks
    .replace(/\r?\n/g, "`n") // Replace newlines
    .replace(/`n/g, "") // Replace newlines
    .replace(/\$/g, "`$"); // Escape dollar signs
}

// Function to generate WAV from text using PowerShell
async function textToWav(text, wavPath, rate = 0) {
  try {
    // Escape single quotes in the text for PowerShell
    const escapedText = escapeForPowerShell(text);

    console.log(escapedText);

    // Construct the PowerShell command
    const command = `PowerShell -Command "Add-Type -AssemblyName System.Speech; $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; $synth.Rate = ${rate}; $synth.SetOutputToWaveFile('${wavPath}'); $synth.Speak('${escapedText}'); $synth.Dispose()"`;
    // Execute the PowerShell command
    await execAsync(command);
    console.log("WAV file created:", wavPath);

    // Convert WAV to MP3
    await convertWavToMp3(wavPath);
  } catch (err) {
    console.error("Error generating WAV:", err);
  }
}

// Function to convert WAV to MP3 using ffmpeg
async function convertWavToMp3(wavPath) {
  try {
    const mp3Path = wavPath.replace(".wav", ".mp3");

    // Execute the ffmpeg command
    await execAsync(`ffmpeg -i "${wavPath}" "${mp3Path}"`);
    console.log("MP3 file created:", mp3Path);

    // Remove WAV file after conversion
    fs.unlink(wavPath, (err) => {
      if (err) console.error("Error deleting WAV file:", err);
    });
  } catch (err) {
    console.error("Error converting to MP3:", err);
  }
}

module.exports = textToWav;
