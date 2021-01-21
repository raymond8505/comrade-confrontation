# Comrade Confrontation

Two teams of compatriots face off to see who is more in touch with _The Will of the People_.

Test your knowledge of The Motherland and her peoples against your brothers and sisters of The Proletariat (Land owners need not apply).

Totally different from Family Feud, I swear it on the grave of Vladimir Lenin. Please to not looking too closely.

WiP

## Game Play

There are 3 regular rounds and 1 Rapid Rubles round. The winner of the game is the team with the most points after 3 regular rounds. Rapid Rubles is an extra round the winning team plays to determine who has control of The Stakes.

### The Stakes

The Stakes is an optional "dare" or some other thing the winning team decides, _if_ they score 200 or more in Rapid Rubles.
ex: "losing team chugs their beers". The Stakes are decided by The Host during game creation. If The Host leaves The Stakes blank, the game will choose for them at random.

### Regular Rounds

A regular round asks 1 question, with a variable amount of answers. The team who controls the round decides if they want to **play** to try and guess all the question's answers, or **pass** to the other team who will try to guess all the answers.

If the team playing the round guesses wrong 3 times, the round passes to the other team to steal.

#### Head 2 Head

Each regular round starts by having 1 player from each team try to answer the same question. The Host starts the round, then reads the question. The first player to buzz in by clicking the **buzz** button on screen, or pressing their space bar gets to guess an answer. If they guess the #1 answer, they are given control of the round and asked if they want to pass or play.

If the buzzed player guesses wrong, or guesses an answer that isn't #1, the other player is given a chance to guess. If the second player guesses any answer higher than player 1, their team takes control of the round. Otherwise player 1 gets control.

If neither player answers correctly, this continues back and forth until one does.

Once a team is given control of the round, they can choose to **play** the round, or **pass** it to the other team.

#### Answering the Question

Players on the controlling team are asked sequentially to answer the question. If they answer correctly, the host reveals the answer by clicking it. If the player answers incorrectly, the host clicks one of the "wrong" Xs at the bottom of the board. If a team answers incorrectly 3 times, control passes to the other team for a chance to steal the round. If the other team cannot steal, all revealed points multiplied by the round number go to the current team.
#### The Steal

A team steals the round when they correctly guess one of the remaining hidden answers to a question. If the steal is successful, all revealed points multiplied by the round number are awarded to them, otherwise the points are awarded to the other team.

#### Round Wrap Up

The Host can optionally reveal any unguessed answers once a round's points have been awarded. It's up to The Host what order this occurs in, but standard practice is least to most.
### Rapid Rubles

In Rapid Rubles, the team who won the regular rounds chooses 2 players to answer 5 questions. The questions are answered in rapid succession within a given time limit.

The second player should mute, or otherwise not listen to the answers given by the first player. Once the first player has answered the questions, or run out of time, The Host tallies and submits their points. The process repeats with the second player.

While answering, if the second player answers the same as the first player, The Host notifies them of their duplicate answer and the player guesses again. The Host can tell the player this verbally, and optionally can press escape (ESC) to sound the 'wrong' buzzer.

After both players' answers are submitted, The Host reveals the answers to the players one at a time. If both players' answers add up to 200 or more, that team controls the stakes. If they did not combine for 200 or more, the losing team controls the stakes.

## Release Notes

### 1.9.0
- Performance tweaks on modals
- About modal now includes instructions on how to play the game
- Sound mute preference now remembered between games
- point fields disabled when Rapid Rubles round in progress to simplify answer entry
- Game Settings now provides buttons to cycle through random team name and stake suggestions
- Rapid Rubles answers now only shown when round is stopped to simplify answer entry
- Answers now have their number displayed to the Host for easy reference in game
- Rapid Rubles Help modal now includes timer lengths for Host reference
- Rapid Rubles questions now drawn from database like regular round question
- Fixed bug that prevented answer clicking in Rapid Rubles
- Made answer clicking process simpler- points will go to the points field of the last selected answer or points field, additionally, the points field that was filled will become focused after filling
- Hovering on the game code will display the phonetic pronunciation of the code, for verbally relaying it to players in video chat.
- Rapid Rubles answer board now displays the timer for each player above the board.
### 1.8.0
- Pressing enter in a field on sign in now submits the form
- The host can see the stakes on the Rapid Rubles board now
- Pressing up or down arrow on the Rapid Rubles board as host now navigates through the answer fields
- There's now a help button on the Host Rapid Rubles board that will show instructions and keyboard controls for fast answer entry during Rapid Rubles
- The reveal of Rapid Rubles answers is now split between answer and points with corresponding sounds for a right answer and wrong answer
- fixed bug where revealing Rapid Rubles answers logged out the host
- Tense background music added for the question asking portion of Rapid Rubles
- Host now has the ability to skip between rounds, back and forth. I added this to speed up testing, but you can use it in conjunction with the replace question button to add extra rounds to your games ;)
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
