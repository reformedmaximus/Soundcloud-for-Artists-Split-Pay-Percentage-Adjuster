# Soundcloud-for-Artists-Split-Pay-Percentage-Adjuster
![Script Showcase](https://github.com/reformedmaximus/Soundcloud-for-Artists-Split-Pay-Percentage-Adjuster/blob/main/script%20showcase.gif?raw=true)

This Tampermonkey script is designed for artists on SoundCloud who need to dynamically adjust the split percentages between payees. The script offers flexibility, automation resistance, and user-friendly configuration.

## Features

- **Dynamic Adjustment**: Easily adjust the split pay percentages between two payees to any desired ratio. The configuration section is well-documented, making it straightforward to change percentages as needed.
  
- **Automation Resistance**: The script is built to handle unexpected page reloads due to PUT or GET requests, which is usually triggered by the platform's security mechanisms detecting automation behavior. The script automatically reloads the page and resumes from where it stopped, meaning it will continue on working efficiently no matter what.

- **Efficiency Check**: Includes a fast checker to verify if the split pay percentages are already set as desired before making any adjustments.

- **Customizable Delays**: You can also adjust the delays between action sequences to simulate more human-like interactions, if that's something you're interested in.

## Installation

1. Install Tampermonkey on your browser from the [official site](https://www.tampermonkey.net/).
2. Click [here](https://raw.githubusercontent.com/reformedmaximus/Soundcloud-for-Artists-Split-Pay-Percentage-Adjuster/main/split%20pay.js) to load the script automatically into Tampermonkey, or copy and paste the script manually into a new Tampermonkey user script.
3. Save the script and enable it on https://artists.soundcloud.com/earnings/splitpay/owned to start adjusting your split pay percentages on SoundCloud.

## Configuration

go to the configuration section in the script and the rest is pretty self explanatory.
