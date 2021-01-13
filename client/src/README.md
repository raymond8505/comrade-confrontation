# Comrade Confrontation

Two teams of compatriots face off to see who is more in touch with _The Will of the People_.

Test your knowledge of The Motherland and her peoples against your brothers and sisters of The Proletariat (Land owners need not apply).

Totally different from Family Feud, I swear it on the grave of Vladimir Lenin. Please to not looking too closely.

WiP

## Release Notes

### 1.7.0
- In Rapid Rubles, the first player's total score is visible on submit, but not the answers
- In Rapid Rubles, host can press Escape (esc) to sound the 'wrong' buzzer if a player answers a duplicate
- When asked to pick a team, the current player count of each team is now displayed in brackets
- minor design tweaks
- Host can now edit scores at will by clicking the pencil in each score box
- "New Question" is now "Replace Question" for clarity about its function
- fixed a bug where question picker options disappeared on click
- A loading message is now displayed when questsion load in pickers, or by clicking "Replace Question"
- The Host can now only select a correct answer _after_ someone has buzzed in
- New questions will be coming on a frequent basis
### 1.6.0

- The player who successfully buzzes will turn yellow for everyone in the player list
- game theme now plays when you join the game
- the currently focused answer in Rapid Rubles now highlights yellow for the host
- when entering rapid rubles answers, the host can press enter to skip to the next answer for faster answer entering
### 1.5.0

- Family Feud theme plays between rounds- is stopped when round starts.
- Stakes modal now more mobile friendly
- Rapid Ruble stakes are now shown to the Host while picking questions
- Rapid Rubles question options now filtered to only 3 and 4 answer questions for more consistent RR difficulty
- Host question picker for Rapid Rubles now contains instructions
- Pass or Play modal more mobile friendly
- Question is hidden from host until round is started to prevent host accidentally reading the question before anyone is able to buzz
- New Question button now only chooses new questions with the same number of answers as the question to be replaced
- When a modal is open, user can now interact with things under the modal- namely logout and mute
- Fixed issue where the game stuck in head 2 head stage until the #1 answer was selected

### 1.4.0

- Question Picker Modal at start of game replaced with Game Settings Modal allowing host to configure options for the game
- Host can now enter custom team names. If the fields are left blank, the game will randomly assign 2 names
- Host can now enter stakes for Rapid Rubles. The team who wins the regular 3 rounds moves on to Rapid Rubles. If they score over 200 points combined in Rapid Rubles they decide who the stakes apply to.
- Host button disables AND disappears now when the code field on Sign In contains data.
### 1.3.0

- Rapid Rubles now shows the combined total of both players answering
- A sound now plays when a Rapid Rubles answer is revealed
- basic responsive adjustments for phones and tablets. more to come... eventually (you should still host from a computer, for optimal experience)
- the host game button disables if the code field contains text to prevent accidentally hosting instead of joining a game, especially one shared with you via a share link
- fixed issue where host couldn't see who buzzed in h2h
### 1.2.0

- Host can now reveal answers individually after a regular round completes. "reveal" sound will play for each reveal and the answer will fade for the host
- Clicking the game code at the top of the board will copy a share link to your clip board to share with friends to join the game
- The current score tally for the round is now displayed on the question board during regular rounds
- Fixed issue of auto joining non-existent games
- There is now a control in the bottom left corner of the board to toggle muting of all sounds.

### 1.1.0

- login now remembers your last username
- host control added to change the current round's answer mid round and reset the round in case of liquor related host "uh ohs"
- question picker at start of round now shows number of answers for each question
- Round number is now a multiplier for round points in regular rounds
- Clicking the buzzer dot beside either team toggles the active team (host only, obvi)
- Rapid Rubles timers set to 40s and 50s. Subject to change again after some testing.
- When the host starts a Rapid Rubles round, the first answer field is auto focused to speed answer recording
- new sounds added
- game joining restricted without player name
- added on screen buzzer button
- players now removed from player list on disconnect
- games older than 30 mins are pruned automatically
- round number is now replaced with "pass or play?" message instead of the old modal that obscured the board
