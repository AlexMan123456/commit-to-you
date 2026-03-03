Output "4-alex-c-line/dist/release.mp4"

Set FontSize 28
Set Width 1200
Set Height 700
Set Padding 40
Set Theme "Dracula"

Type "alex-c-line template release-note create major"
Enter
Sleep 2s

Type "alex-c-line template release-note check docs/releases/v2/v2.0/v2.0.0.md --expected-release-status In_progress"
Enter
Sleep 1s

Type "alex-c-line template release-note check docs/releases/v2/v2.0/v2.0.0.md --expected-release-status Released"
Enter
Sleep 2s

Type "alex-c-line template release-note set-status docs/releases/v2/v2.0/v2.0.0.md Released"
Enter
Sleep 1s

Type "alex-c-line template release-note check docs/releases/v2/v2.0/v2.0.0.md --expected-release-status Released"
Enter
Sleep 4s
