## Allgemeines

Mit dieser Web-App stellt den Benutzer einen vollfunktionalen Audio- und Videoplayer zur Verfügung. Mittels des Browsers können User ganz einfach entsprechende Formate einladen und diese dann per Web-Interface oder einem angeschlossenen MIDI-Controller verwalten, steuern, mixen oder mit Effekten überlegen.

#### Background
Hierbei handelt es sich um ein Projekt welches im Rahmen des Moduls Audio- und Videotechnik als Teil des Studiengangs Angewandte Informatik an der HTW Berlin angefertigt wurde. 

#### Teammitglieder
Konstantin Bruckert (558290)

Martin Müller (553459)

#### Verwendete Technologien
Generell wurde das Tool in Javascript mittels NodeJS geschrieben. Für das Abspielen, manipulieren und Mixen von Audio-Datein wurde die Web-Audio-API verwendet. Für das Streamen von Videos wird der DashJS Media-Player. Auf die Videos anzuwendende Effekte entstehen mit HTML-Canvas.


## Ausführen

#### Voraussetzungen
Für den Start der Anwendung sind folgende Programme zwingend erforlderlich:
* Node.js / npm
* Chrome Browser

Überdies muss ein Midi-Controller das System angeschlossen werden.

#### Clonen des GIT-Repos:
Über das Terminal kann das GIT-Repo gecloned werden:

`git clone git clone https://bitbucket.org/Butanding/audiovideotechnik.git`
(Achtung, zugang wird kurz nach veröffentlichung gesperrt)

Dann wechselt man in den neuen Ordner:

`cd av_midi`

Beim erstmaligen Start der Applikation müssen im folgenden müssen die Dependencies des Node.js servers heruntergeladen und installiert werden:

`npm install`

#### Starten
Mittels des folgenden Befahls kann die Web-App nun gestartet werden

`npm start`

Im Normalfall wird die Web-App nun automatisch im Standard-Browser geöffnet. Falls dies nicht geschieht, kann auch über die folgenden Adresse der Server erreicht werden:

`http://127.0.0.1:8080/`


## Funktionen (Basis-Funktionen)
Die Anwendung bietet folgende Funktionen
* Einbindung eines MIDI-Controllers
* Zeitgleiches Abspielen von bis zu 4 Audiotracks
* Zeitgleiches Abspielen von bis zu 2 Videos
* Adaptives Streamen von Audio/Video mittels MPEG-DASH
* Separate Lautstärkekontrolle der Medien
* Implementierung eines nicht-linearen Crossfaders
* Chroma-Keying aller Videos
* Dynamisches Laden von Audio-Datein mittels Drag-n-Drop
* Zu bestimmten Punkt springen (Audio/Video)
* Wiedergabe einzelner Audio-Tracks in einer Dauerschleife


##Zusätzliche Features
* UI/UX-Design der Nutzer-Oberfläche mittels Bootstrap
* Mehr-Band-Equalizer (lowshelf, bandpass, highshelf)
* Manipulation der Abspielgeschwindigkeiten
* Visualisierungen der Audiosignale (Canvas-Animation)
* Laufschrift im Video
* Grafische Filter für Videos (Color-Inverter)

    
## Bedienung

#### Bedienung des MIDI-Controllers
####Folgende Funktionen können mittels des Midi-Controllers gesteuert werden:
* seperates Starten/Stoppen der 4 Audio-Spuren
* gleichzeitiges Starten/Stoppen aller Audio-Spuren
* seperates regeln der Lautstärke für alle 4 Audio-Spuren
* gleichzeitiges muten/unmuten aller Audio-Spuren
* gleichzeitiges Starten/Stoppen aller Video-Spuren
* gleichzeitiges Muten/Unmuten aller Video-Spuren
* Loopen/Unloopen der spielenden Audiofiles
* Manipulation der Abspielgeschwindigkeiten
* Manipulation von High-/Low-Pass Filter
* Zurücksetzen aller geladenen Tracks
* Bedienung des Crossfaders

#### Bedienung der Web-App
Audio-Datein können in beliebigen Audioformat entweder über den Upload-Button oder per Drag-and-Drop in der markierten Fläche eingeladen werden. Sie erscheinen der Reihe nach auf dem nächsten frei belegbaren der 4 Slots. Sind alle Slots voll, muss zuerst ein Track aus dem Panel entfernt werden. Über den Main-Audio-Controller können nun Channelübergreifende Einstellungen vorgenommen werden und über die einzelnen Audio-Panels können Chanelspeziefische Manipulationen vorgenommen werden.

Video-Dateien können im ".mpd"-Format aus dem lokalen Ordner "./res/video/" eingeladen oder per URL gepasted werden. Zudem besteht die Möglichkeit aus einer Reihe von Sample-Videos per Zufall Videos einzuladen. Zu beachten ist, dass bei den Zufalls Videos keine Garantie für die Verfügbarkeit der Videos auf entfernten Rechnern oder die stabilität der Internetverbindung des Anwenders gegeben wird. Sollten Sie sich hierbei nicht sicher sein, verwenden Sie ein oder mehrere der mitgelieferten lokalen Videos im Ordner "./res/video". Wichtig ist auch, dass Videos aus Sicherheitsgründen NUR aus diesem Ordner geladen werden dürfen (Javascript Policiy).  Über den Main-Video-Controller können nun Channelübergreifende Einstellungen vorgenommen werden und über die einzelnen Video-Panels Chanelspeziefische Manipulationen vorgenommen werden.
