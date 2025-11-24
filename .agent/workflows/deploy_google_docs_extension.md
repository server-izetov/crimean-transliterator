---
description: How to deploy the Crimean Tatar Transliterator extension to Google Docs
---

# Deploying to Google Docs

Since this is a Google Apps Script project, you can deploy it by copying the code into the Google Apps Script editor.

## Prerequisites
- A Google Account
- Access to [script.google.com](https://script.google.com)

## Steps

1.  **Create a New Project**
    - Go to [script.google.com](https://script.google.com/home/start).
    - Click **"New Project"** (top left).
    - Name the project "Crimean Tatar Transliterator".

2.  **Enable Manifest File**
    - In the editor, click the **Project Settings** (gear icon) on the left sidebar.
    - Check the box **"Show 'appsscript.json' manifest file in editor"**.

3.  **Copy Files**
    - You need to create/update the following files in the online editor to match your local files:

    ### `appsscript.json`
    - Click on `appsscript.json` in the editor.
    - Replace its content with the content of your local `appsscript.json`.

    ### `Code.gs` (or `Code.js`)
    - Rename the default `Code.gs` to `Code` if needed (extension is automatic).
    - Replace its content with your local `Code.js`.

    ### `Transliteration.gs`
    - Click **+ (Add a file)** -> **Script**.
    - Name it `Transliteration`.
    - Paste the content of your local `Transliteration.js`.

    ### `Sidebar.html`
    - Click **+ (Add a file)** -> **HTML**.
    - Name it `Sidebar`.
    - Paste the content of your local `Sidebar.html`.

4.  **Test the Extension**
    - Open a Google Doc (create a new one or open an existing one).
    - Refresh the page.
    - *Note: Since this is a standalone script not bound to a specific doc yet, checking it might be tricky unless you publish it or use it as a container-bound script.*
    
    **Better Method for Testing (Container-bound):**
    1. Open a Google Doc.
    2. Go to **Extensions** > **Apps Script**.
    3. This opens the editor *bound* to that specific document.
    4. Follow the "Copy Files" steps above in this new window.
    5. Save all files (Ctrl+S).
    6. Go back to your Google Doc and refresh.
    7. You should see a new menu item: **Transliteration** (it might take a few seconds).
    8. Click **Transliteration** > **Start Transliteration**.
    9. Grant the necessary permissions when prompted.

5.  **Use It**
    - Select text and click "Cyrillic -> Latin" in the sidebar.