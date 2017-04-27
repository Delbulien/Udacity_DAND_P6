# Udacity_DAND_P6
Data Visualization: Make effective data Visualization

# Summary  
The evolution of the amount borrowed by people in the united state through prosper Loan shows a sharp decrease when the Subprime Mortgage crisis happened.
The decrease of the Prosper Loan bussiness is uniform in the united state.

Prosper Loan is a pear to pear lending industry: https://en.wikipedia.org/wiki/Prosper_Marketplace 
Subprime Mortgage crisis was a nationwide banking emergency that contributed to the U.S. recession of December 2007 – June 2009 : https://en.wikipedia.org/wiki/Subprime_mortgage_crisis

# Design  
A line/scatter chart has been choosen in order the display the time evolution of the global amount borrowed through Prosper Loan.  
A map has been made to display the split the global amount borrower in a given year in the USA states. A circle with a surface proportional 
to the amount borrowed in the state aims at easily see whether the population of a state is using Prosper Loan or not. Vectors with uniform module but 
with an orientation depending on the relative evolution of the amount is use in order to support the point that the recession has uniformly impacted 
all the states. 
The Subprime Mortgage crisis period is highlighted on the line chart with a red area. 
The time period chosen for the line chart is 2006-2013. No Prosper Loan have been made in 2005. In orer to display the relative growth, I had to stop the line 
chart one year before the last year for which data are available.  
The user has the possibility to click on the line chart point in order to construct its own story. At the end of the initial animation, when a point is clicked, 
its color and radius are changed in order help remember which one has been clicked.

# Versionnig  
	Original commit Apr 6, 2017:
		Initial version. Only the map part with the circles representing the amount borrowed through Prosper Loan in the states through the year exists
		
	Commits on Apr 20, 2017
		Addition of the line chart to support the "story" I had in mind
		
		==> request for feedbacks made here
		
	Commits on Apr 25, 2017
		Addition of title and improvement of display and text part with <div> tag
		Add legend based on feddback received
		Addition of the source of the data and author of the vizualisationbased on feddback received
		Addition of README.md
	
		==>first submission
	
	Commits on Apr 27, 2017
		Change title and explanation text
		Add red area in line chart to highlight subprime Mortgage crisis period.
		Change of the radius and of the circle color of the line chart during the animation
		Correction of the bug which led to display the wrong point on line line chart.
		Change map: 
			All states are uniformly colored in gray
			opacity used on Circles
			Addition of the relative growth rate represented by a vector in order to support the "story": uniform decrease of the Prosper Loan in all the states
		Correction of the README.md with the reviewer's remarks.
		
		==>Second submission
		
		
# Feedback  
  Peter:  
  ------  
What do you notice in the visualization?[Peter]  The trend seems to be similar for all states; it doesn’t look like there are one or more states where the amount increases disproportionally to other states  
What questions do you have about the data?[Peter]  It would be nice to be able to hover over the individual states and get the corresponding values. Also why do some states tend to borrow more than others? Is it correlated to population? The states which are left blank, is it because no data is available or were there really no loans in those states?  
What relationships do you notice?[Peter]  The link between the overall amount and the amount of the individual states seems to vary similarly over the years.  
What do you think is the main takeaway from this visualization?[Peter]  Either people didn’t learn from the crisis and we’re headed for another bubble. Or people have confidence that the same crisis would not be possible a second time.  
Is there something you don’t understand in the graphic?[Peter]  Why is there a drop in 2014?  

  Nayan:  
  ------  
What do you notice in the visualization?[Nayan]  The amount borrowed through Prosper loan increases rapidly between 2009-2013 despite the occurrence of  subprime crisis. This global trend holds true at states level as well. However, there are three states shaded white (= 0 loan??) post 2009.   
What questions do you have about the data?[Nayan]  Same as what Peter raised. Also, from my point of view, the overall title of the visualization should say “total amount of money borrowed and its distribution across states” to set the expectations correct. Also, I would prefer to include the source of data in the plot (not sure if it’s possible to do like a legend or something). The first question I had in mind was where are these numbers coming from , before I start believing them and analyzing them.    
What relationships do you notice?[Nayan]  The distribution of overall money borrowed between states seems to remain similar across years.  The big states like on east and west coast and Texas always get a big share.    
What do you think is the main takeaway from this visualization?[Nayan]  I am not much knowledgeable in finance, but I guess it suggests that the credit business is blooming and investments in such business is encouraged. I am not sure if a comment can be made on people psychology.   
Is there something you don’t understand in the graphic?[Nayan]  The drop is 2014 for sure and why three states are shaded white constantly after 2009.  

  Renaud:  
  -------  
What do you notice in the visualization?[Renaud] animation of both graphs (global view per year) and map (split per state). Now Strong states = strong money borrowed, no data available for some states.  
What questions do you have about the data?[Renaud] Why some states have no got any data?  
What relationships do you notice?[Renaud] Correlation between the graph (total amount) and the map (amount split per state and visualized with filled circle, its diameter relies on the amount split).   
What do you think is the main takeaway from this visualization?  
Is there something you don’t understand in the graphic?[Renaud] All is clear  



# Resources    
  Several posts on https://stackoverflow.com/
