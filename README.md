# Collection-of-projects
This is a collection of various programs I have made. Each was done in my own time since I find solving problems like this extremely rewarding.

Diffraction
- folder contains the program used for analysis, the data and the plots produced
This program was created to aid in my lab work as part of my physics degree, however it was well beyond the expected level of analysis needed for this particular lab experiment. The experiment involved measuring the diffraction pattern produced by a variety of slit groups, with varying slit width, slit separation and number of slits. Through analysis of the intensity-angle relationship, the diffraction pattern was fitted to a curve of equations found theoretically from the application of the Huygens–Fresnel principle. From this, estimations of the parameters mentioned could be found. 
The program also saves the plots in the folder called plots, which is also attached. Optically, it is clear that the fitted functions agree well with the measured data, especially for n (number of slits) >1.
One issue with this program is that the curve fitting approach can sometimes be sensitive to the choice of starting parameters. My solution was to manually set the starting parameters in these cases. However, a more general approach of estimating the starting parameters accurately would be preferred. Despite this, I am still happy with this approach since it worked well for our limited data set.


Naughts and crosses ai
- Link to source code in p5.js: https://editor.p5js.org/Adsa2/sketches/PzzxPIh7f

This is a program I wrote in my first year at university as I was interested in the idea of move generation algorithms (i.e chess engines). I wrote this to see if I could create an unbeatable noughts and crosses Ai from my understanding of recursive algorithms. Since this was more of a proof of concept, the code is not very optimised and there are a number of improvements that could be made:

- Improve the gameOver function (function to return who has won in a given game instance). This is not a very eloquent solution and is also not efficient. An easy improvement would be to return null automatically if less than 5 moves have been made (since it would be impossible to have won)

- Improve the move selection when presented with identical game values. At the moment, the choice between two winning moves is random. However, the move that results in the shortest forced win should be selected (has the amusing effect of stalling out the game but ensuring it can always still win). Furthermore, the choice between two drawing moves should favour the move that encounters the most winning game states during the min max algorithm.

-  Reduce the redundant searches made. A common improvement to minmax algorithms is Alpha Beta pruning, where the total searches is reduced

- remove continual evaluation of the same position. Since the game is extremely simple, there is no max depth limit so the whole game tree is computed on move 1. This could just be pre-processed and stored, and then the computer could look-up the best move in that position for each of its goes. This approach is used in connect 4 and also simple chess endgames (tablebase)

