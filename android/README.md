# Days Since Counter Widget (Android Home Screen Widget)

This project is a native Android application that provides a highly customizable Home Screen Widget. It allows you to count down to a target date or count up from a past date.

## Features
- **Configurable Widget**: Set the date, mode, font size, and color.
- **Home Screen Support**: Fully resizable widget with a modern transparent design.
- **Dark Mode**: Supports system-wide dark mode throughout the configuration app.
- **Material You**: Uses Jetpack Compose for a modern UI experience.

## Building the App
To build this project and generate an APK:

1.  **Prerequisites**:
    - Install [Android Studio](https://developer.android.com/studio) (Hedgehog or newer recommended).
    - JDK 17.
2.  **Clone/Download**:
    - Place all files in a folder.
3.  **Build with Android Studio**:
    - Open Android Studio and select "Open" on the `android/` directory.
    - Wait for Gradle sync to complete.
    - Click `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
4.  **Build with Command Line**:
    ```bash
    cd android
    # Note: You may need to generate a wrapper if missing, or use your local gradle
    gradle assembleDebug
    ```

## F-Droid Submission
This project is structured according to Android's modern best practices (Kotlin, Gradle, Compose). To publish on F-Droid:
1. Create a GitHub/GitLab repository.
2. Upload the `android/` directory contents (or move the contents to the root of the repo).
3. Follow the [F-Droid inclusion process](https://f-droid.org/docs/Inclusion_Policy/).

## Project Structure
- `app/src/main/kotlin/com/dayssince/MainActivity.kt`: The settings UI.
- `app/src/main/kotlin/com/dayssince/DaysWidgetProvider.kt`: The core widget logic and RemoteViews update.
- `app/src/main/res/layout/widget_layout.xml`: The visual design of the home screen widget.
