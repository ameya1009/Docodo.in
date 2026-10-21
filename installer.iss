[Setup]
AppName=AK Assistant
AppVersion=0.1.0
AppPublisher=AK Labs
AppPublisherURL=https://example.com
AppSupportURL=https://example.com/support
AppUpdatesURL=https://example.com/update
DefaultDirName={pf}\AK Assistant
DefaultGroupName=AK Assistant
DisableProgramGroupPage=yes
OutputBaseFilename=AK_Assistant_Installer
Compression=lzma
SolidCompression=yes
SetupIconFile=AKAssistantIcon.ico
WizardImageFile=setup_wizard.bmp
WizardSmallImageFile=setup_small.bmp
LicenseFile=LICENSE.txt
InfoBeforeFile=installer-info-before.txt
InfoAfterFile=installer-info-after.txt
Uninstallable=yes
UninstallDisplayName=AK Assistant
UninstallDisplayIcon={app}\AKAssistantIcon.ico

[Files]
Source: "dist\AK Assistant.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "AKAssistantIcon.ico"; DestDir: "{app}"; Flags: ignoreversion
Source: "installer-info-before.txt"; DestDir: "{app}"; Flags: dontcopy
Source: "installer-info-after.txt"; DestDir: "{app}"; Flags: dontcopy

[Icons]
Name: "{group}\AK Assistant"; Filename: "{app}\AK Assistant.exe"; IconFilename: "{app}\AKAssistantIcon.ico"
Name: "{commondesktop}\AK Assistant"; Filename: "{app}\AK Assistant.exe"; IconFilename: "{app}\AKAssistantIcon.ico"

[Run]
Filename: "{app}\AK Assistant.exe"; Description: "Launch AK Assistant"; Flags: nowait postinstall skipifsilent

[Messages]
WelcomeLabel1=Welcome to the AK Assistant setup wizard.
WelcomeLabel2=AK Assistant installs a powerful local and online AI helper on your PC.
FinishedLabel1=AK Assistant is now installed and ready to help you solve problems.
UninstallLabel1=This will remove AK Assistant from your computer.
UninstallLabel2=Your settings and local model files will remain untouched.
