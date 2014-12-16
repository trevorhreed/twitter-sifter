app.controller('about', ['$scope', function($scope){
	
}]);
app.controller('home', ['$scope', '$timeout', 'Miner', function($scope, $timeout, Miner){
	$scope.error = false;
  $scope.charts = [];
	$scope.capture = function(files){
    $timeout(function(){
      var doc = files[0];
      if(doc.type != 'text/csv'){
          $scope.error = "Invalid file type. Must be a *.csv file!";
      }else{
        $timeout(function(){
          
          function count(row, val){
            if(val === undefined){
              return 1;
            }else{
              return ++val;
            }
          };
          miner = new Miner(doc.data);
          
          if($scope.filetype == 'byuser'){
            
            var data = [["City","User","Tweets"]];
            for(var i in miner.data){
              var row = miner.data[i];
              data.push([
                row['Location'],
                row['Username'] + " (" + row['Location'] + ")",
                row['Number of tweets']
              ]);
            };
            console.log("DATA");
            console.dir(data);
            $scope.charts.push({
              "title": "Tweets By User",
              "type": "GeoChart",
              "displayed": true,
              "options": {
                "region": "US",
                "displayMode": "markers",
                "colorAxis": {
                  "colors": ["yellow", "red"]
                }
              },
              "data": data
            });
            
            
          }else if($scope.filetype == 'bytweet'){
            
            var rows = miner.groupBy('Location', count),
                data = [["City","Tweets"]];
            for(var i=0; i < rows.length; i++){
              var row = rows[i];
              data.push([
                row['label'],
                row['value']
              ]);
            };
            $scope.charts.push({
              "title": "Tweets By Location",
              "type": "GeoChart",
              "displayed": true,
              "options": {
                "region": "US",
                "displayMode": "markers",
                "colorAxis": {
                  "colors": ["yellow", "red"]
                }
              },
              "data": data
            });
            
          }
          
          
          
          
          /*
          var data = miner.groupBy('User Name', count),
              rows = [];
          for(var i=0; i < data.length; i++){
            var row = data[i],
                fields = [];
            fields.push({
              "v": row['label']
            });
            fields.push({
              "v": row['value']
            });
            rows.push({
              "c": fields
            });
          }
          $scope.tweetsByUsers = {
            "type": "Table",
            "displayed": true,
            "options": {
              "sortColumn": 1,
              "sortAscending": false
            },
            "data": {
              "cols": [
                {
                  "id": "user",
                  "label": "Tweeter User Name",
                  "type": "string",
                  "p": {}
                },
                {
                  "id": "count",
                  "label": "# of Tweets",
                  "type": "string",
                  "p": {}
                }
              ],
              "rows": rows
            }
          };
          */
          
        });
        
      }
    });
	};
}]);
app.controller('layout', ['$scope', '$location', function($scope, $location){
	$scope.places = [
		{
			title: 'Analyze',
            link: 'Analyze',
			url: '#/'
		},
		{
			title: 'Tweeting the Discipline',
            link: 'About',
			url: '#/tweeting-the-discipline'
		}
	];
	
	$scope.$on('$locationChangeStart', function(event) {
		var curPath = "#" + $location.path();
		for(var i=0; i < $scope.places.length; i++){
			var place = $scope.places[i];
			if(place.url == curPath){
				$scope.title = place.title;
				place.selected = true;
			}else{
				place.selected = false;
			}
		}  
	});
	
}]);
app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'home',
			controller: 'home'
		})
		.when('/tweeting-the-discipline', {
			templateUrl: 'about',
			controller: 'about'
		})
		.otherwise({redirectTo: '/'});
}]);

app.run(['$route', angular.noop]);

angular.module('twitterData', [])
.factory('Miner', [function(){
  return function constructor(raw){
    var me = this;
    (function(){
      me.csv = Papa.parse(raw, {
        header: true,
        dynamicTyping: true
      });
      me.data = me.csv.data;
      me.headers = me.csv.meta.fields;
    })();
    
    me.count = function(column, pattern){
      var count = 0;
      for(var i=0; i < me.data.length; i++){
        if(me.data[i][column].match(pattern)){
          count++;
        }
      }
      return count;
    }
    me.groupBy = function(groupColumn, aggregatorFn){
      var hash = {};
      for(var i=0; i < me.data.length; i++){
        var row = me.data[i],
            key = row[groupColumn];
        hash[key] = aggregatorFn(row, hash[key]);
      }
      var arr = [];
      for(var p in hash){
        arr.push({
          'label': p,
          'value': hash[p]
        });
      }
      return arr;
    }
  }
  
  /*
  return {
    'refine': function(raw){
      var rows = [],
          columns = {},
          rawRows = raw.split('\r'),
          headers = rawRows.shift().split(',');
      for(var i in rawRows){
        var rawCells = rawRows[i].split(','),
            row = {};
        for(var k in rawCells){
          row[headers[k]] = rawCells[k];
          if(!columns[headers[k]]){
            columns[headers[k]] = [];
          }
          columns[headers[k]].push(rawCells[k]);
        }
        rows.push(row);
      }
      return {
        'rows': rows,
        'cols': columns
      };
    }
  }
  */
  
}]);
var up = angular.module('up', [])
  .directive('upDropzone', function () {
    function capture(objs, onDrop){
      var files = [],
          inQueue = files.length;
      for (var i = 0; i < objs.length; i++) {
        (function(o){
          var reader = new FileReader();
          reader.onload = function (e) {
            files.push({
              'lastModified': o.lastModified,
              'lastModifiedDate': o.lastModifiedDate,
              'timeStamp': e.timeStamp,
              'name': o.name,
              'type': o.type || "",
              'data': e.target.result,
              'size': e.total
            });
            if (--inQueue <= 0) {
              onDrop(files);
            }
          };
          reader.readAsText(o);
        })(objs[i]);
      }  
    }
    return {
      scope: {
        onDrop: '=upOndrop',
        onDropClass: '=upOndropClass'
      },
      link: function (scope, $el, attrs) {
        var el = $el[0];
        el.addEventListener('click', function(e){
          var fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.style.display = 'none';
          $('body').append(fileInput);
          fileInput.click();
          $(fileInput).change(function(e){
            capture(e.target.files, scope.onDrop || angular.noop);
          });
        }, false);
        el.addEventListener('drop', function(e){
          e.preventDefault();
          e.stopPropagation();
          if(scope.onDropClass){
            $el.removeClass(scope.onDropClass);
          }
          capture(e.dataTransfer.files, scope.onDrop || angular.noop);
        }, false);
        el.addEventListener('dragover', function(e){
          e.stopPropagation();
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }, false);
        if(scope.onDropClass){
          el.addEventListener('dragenter', function(e){
            for (var i = 0; i < e.dataTransfer.types.length; i++) {
              if (e.dataTransfer.types[i] == "Files") {
                $el.addClass(scope.onDropClass);
                break;
              }
            }
          }, false);
          el.addEventListener('dragleave', function(e){
            $el.removeClass(scope.onDropClass);
          }, false);
        }
      }
    };
  });
angular.module('myapp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('about',
    "<div class=\"applets-about\"><h2><small>Tweeting the Discipline: Knowledge Construction in Digital Spheres and Academic Conferences</small></h2><authors><author>Chen Chen</author><author>Meridith Reed</author></authors><p>The hashtag #cwcon logged over 8,000 tweets this year between May 28 and June 8, according to Collin Brooke’s tweet archive for the 2014 Computers and Writing Conference. The number of tweets gives a sense of how integrated the social media platform has become to the conference experience. Digital social media like Twitter allow conference participants to leave an informal public record of conference proceedings, the tweets and retweets suggesting the reach and influence of particular ideas. The public and digital nature of Twitter also enables both scholars at the conference site and those following the conference proceedings off site to engage in the conference’s conversations, transcending temporal and spatial boundaries. Using a machine reading approach, our project created a tool that could map the tweets across the United States to show the geographical distribution of the participants in these conversations, thus giving a sense of which institutions and academic programs are more active in digitally participating in the conference. Furthermore, we also performed a close reading of a sample of the whole archive to better understand the functions of social media in the duration of an academic conference. Twitter serves a variety of purposes and functions at these conferences: conference attendees use Twitter to share pictures or invitations for drinks, but they also use the platform to extend panel conversations, ask provocative questions about the field, and solicit help in research projects. In this way, Twitter becomes an important site of scholarly discourse where disciplinary identity is formed and new scholarly knowledge is generated. It is not simply digital tool, a nebulous electronic space separate and apart from the physical reality of the conference. Rather, the real scholarly work and scholarly conversations that happen on Twitter are an example of the way in which the “digital” and the “real” are indistinguishable in our world today. The Twitter conversations present a view of where the field is going.</p><p>Unfortunately, the informal record of Twitter is often not kept officially: tweet archives do not exist or are kept inconsistently for many of the conferences in the field of rhetoric and composition. Without consistent or official archiving, there has also not been a formal attempt to analyze these Twitter conversations in a scholarly way. Conferences, like the CCCCs or CWCON, do place live Twitter feeds on their websites, encourage the use of official conference hashtags, and use Twitter and other social media platforms to communicate conference news to attendees and followers, but Twitter is valued more as a logistical broadcasting tool by these conferences, rather than seen for its role as generating disciplinary identity and knowledge. The lack of scholarly attention being given to these digital conversations suggests they are not yet valued as worth academic inquiry. To understand the picture of the field of computers and writing provided by Twitter, more thorough scholarly investigation of the tweets, employing a combination of machine and close reading, is warranted. Our project works to fill that need by creating a digital tool and maps that break down what is happening in these conference tweets and how they shape and generate disciplinary identity and new knowledge in the field.</p><p>In a discussion of the changing roles of the flagship conferences in the field of rhetoric and composition, Colin Brooke identified three waves throughout the history of these conferences (Brooke, blog), and we categorize them in three corresponding models: from an aggregation model to a distribution model to a more interactive and intense distribution model actualized with social media.</p><figure><img src=\"/static/img/image1.png\" alt=\"Figure 1: Three Waves in Development of Flagship Conferences\"><p>Figure 1: Three Waves in Development of Flagship Conferences</p></figure><p>The first model refers to the interchange of ideas and knowledge that only happened when scholars congregated at the academic conferences in one physical location. With the advent of email and listserv, we moved to the second model of linear distribution of knowledge, or the “weak ties” model, as Brooke calls it. The third model, facilitated by Twitter, decentralizes the role of these flagship conferences, which used to serve as the only gathering location for scholars and allows for more dynamic digital experiences. Twitter allows participants to exchange ideas, form relationships and make new knowledge in a virtual network transcending temporal and spatial borders. It allows us to reexamine the way scholars participate in academic conferences and demands that we study the “social scene” of these conferences by tracing associations created by these tweets. As Latour says, “we have to reshuffle our conceptions of what was associated together because the previous definition has been made somewhat irrelevant” (Latour, 2005). The idea that the physical site of an academic conference is the only place for scholars in the field to congregate has become somewhat irrelevant. One no longer needs to even register for the conference to be part of the conversations. Participation takes place virtually in digital spheres. For this reason, it is important that the themes of these digital conversations be formally examined in order to better understand the role they play in shaping the field.</p><p>Nevertheless, Twitter may be overlooked in scholarly investigation because the digital and the “real” are still seen as binaries rather than indistinguishable parts of the same everted reality. As William Gibson (2010) has written, “Cyberspace, not so long ago, was a specific elsewhere, one we visited periodically, peering into it from the familiar physical world. Now cyberspace has everted. Turned itself inside out. Colonized the physical.” Stephen E. Jones (2014) expands on Gibson’s idea of eversion when he writes:</p><blockquote>The metaphor of eversion is particularly resonant, particularly useful, because it articulates a widely experienced shift in our collective understanding of the network during the last decade; inside out, from a world apart to a part of the world, from a transcendent virtual reality to mundane experience, from a mysterious, invisible abstract world to a still mostly invisible (but real) data-grid that we move through every day in the physical world.</blockquote><p>Eversion is a useful concept for our project because it suggests that the idea of an everted reality has not yet been fully accepted or understood in the field. The concept of eversion suggests that what happens in the physical space of the conference itself and what happens online at conferences (either online on site of the conference or from a distance) are part of the same reality and the same work. The disciplinary work done on and offline contribute equally to the content of the conference.</p><p>Johnson-Eilola (2005) has argued that physical and digital spaces and technological tools play an important role in shaping academic work. As Johnson-Eilola writes, the computer “revelation is no longer a coherent, discrete event, but instead a dispersed network of subtle, yet profound changes in patterns of working, living, and communicating.” The use of digital tools changes the way we work and the way we perceive and understand our work. This is true of the work of an individual scholar, but, more significantly for our project, it is also true of the work we do as members of a disciplinary field.</p><p>Kaptelinin and Nardi have stated, in their book Acting with Technology, that “[i]n activity theory people act with technology; technologies are both designed and used in the context of people with intentions and desires” (Kaptelinin and Nardi, 2006). Activity theory challenges the traditional concept of subject and object as the first site of investigation; in the activity theory model, “[a]ctivity is considered the most basic category.” In other words, it is the activity that causes transformation of both subject and object, rather than subject alone acting on the object. According to their definitions of activity theory, “activity is considered the key source of development of both the object and the subject. In particular, developmental changes in the subject, which result from participating in activities and are determined by the nature of these activities, may cause substantial changes in the subject’s properties.” Vygotsky argues human activity relies on cultural artifacts that can often transform the activity (Spinuzzi, 2008). Traditionally, the academic conference has been a key site for disciplinary work: a place for networking, career-building, and knowledge-making. Twitter offers new, digital places that our project will textualize and visualize, and the visualization will in turn spatialize the texts themselves, an important approach in rhetoric and composition scholarship on place that Jenny Rice (2012) advocates.</p><p>Other digital projects in the field have been conducted to informally archive CWCON or analyze the digital conversations, and they provide backing for our project. The Computers and Writing Memorabilia Project (<a href=\"http://computersandwriting.org/memorabilia/\">http://computersandwriting.org/memorabilia/</a>) headed up by Michael Day and John Benson is seeking to archive several forms of conference discourse: t-shirts, conference programs, and online discussions about the conferences. Colin Brooke’s tweet archive (<a href=\"http://www.tweetarchivist.com/cgbrooke/2/media\">http://www.tweetarchivist.com/cgbrooke/2/media</a>) provides some preliminary machine readings of the conference tweets. Laura Van Ett and Laura Gonzales, in response to a digital rhetoric course assignment, Tracing Digital Events, performed a linguistic analysis of the content of the tweets from Computers & Writing conference in 2013. Chris Lindgren, a PhD student at University of Minnesota, studied the key words in the Twitter data from CWCON2014 and visualized the frequency of the key words in various forms (<a href=\"http://www.clindgrencv.com/cwcon14.html\">http://www.clindgrencv.com/cwcon14.html</a>). These projects show the general sense in the field that Twitter is a viable site for scholarly study; however, most of these projects present themselves on interesting snapshots of the field rather than as scholarly investigations. Our project builds on their work and adds the new dimension by mapping the geographical distribution of the participants and discussing the impact of these Twitter conversations on the future direction of the field.</p><p>With the help of professional computer programmer Trevor Reed, we created a website using JavaScript to process the tweets from Collin Brooke’s tweet archive of the CWCON2014 conference. We chose these computer languages because they allowed us to do visualizations that could easily tap into Google’s mapping API. We randomly chose 1000 tweets from the data set across several different dates during the conference and cleaned up the data to display a consistent location format of city and state (e.g. Ann Arbor, MI). The locations listed in the archive show the user-defined location. Most users listed their city of residence, but some listed no location or an abstract one like “a memory palace,” “a thousand places at once,” or “virtually.” In these cases, we assigned the location of the “North Pole” to these tweets. (Google mapped the North Pole in Alaska, hence the large red dot there on our maps.) We used the website coded by Trevor to visualize two sets of data in two separate maps:</p><ol><li>The locations of each tweet in our 1000 tweet sample. Although this map does not distinguish between users who were physically at the conference site and those who were not, we were able to compare this map with Jim Ridolfo’s Rhet Map and see distinct parallels between the locations of jobs in the field of rhetoric and composition and the locations of those participating in the conferences.</li><li>The resident locations and home institutions of the top 25 most frequent contributors to the conversation.</li></ol><p>The maps provide a digital picture of the geographical state of the field as it displays key players in the digital conversations of discipline-building. These maps present visually the central claims of our argument.</p><figure><img src=\"/static/img/image2.png\" alt=\"Figure 2: Tweets Distributed by Location\"><p>Figure 2: Tweets Distributed by Location</p></figure><figure><img src=\"/static/img/image3.png\" alt=\"Figure 3: Jim Ridolfo's Rhet Map\"><p>Figure 3: Jim Ridolfo's Rhet Map</p></figure><p>As the map above shows, Michigan and Indiana are the two states where there are more Twitter users, therefore a stronger Twitter presence at CWCON2014. We can thus argue that the maps highlight the programs that are invested in the types of conversations that are important at the Computers and Writing conference: multimodal composition, digital rhetoric, gaming, etc. If we compare this map with Jim Ridolfo’s Rhet Map shown above, we can see that very similar locations light up in both maps. This comparison shows that the rhet/comp programs currently hiring are also the ones that are most active in the scholarly conversations regarding computers and writing. We can then argue that topics that emerge from computers and writing represent the future direction of the rhet/comp discipline. Although most of the users map onto the locations of rhetoric and composition doctoral programs, there are also users who are from communication programs and interdisciplinary programs. This tells us that computers & writing as a field is open to interdisciplinary work and that the larger field of rhetoric and composition is also branching out to other disciplines. For example, the second most frequent Twitter user, @mgarcia, is from a interdisciplinary doctoral program at University of Michigan in English and Education.</p><figure><img src=\"/static/img/image4.png\" alt=\"Figure 4: Locations of Top 25 Users\"><p>Figure 4: Locations of Top 25 Users</p></figure><p>Colin Brooke’s machine reading of his own archive produced a list of the top 25 most frequent Twitter users during the conference. We researched the users’ real names, home institutions, academic status, and research interests. We were not able to discover the real name of one of these 25 users, but we were able to find all of this information for the other 24 users. The map for the top 25 users shows a distinct pattern. Out of these 25 top users, there are 5 professors and 20 graduate students (mostly PhD students but also a few master students). The 5 who were professors are relatively young in the professional field: assistant and associate professors. Again, Indiana and Michigan are the states that produced more top tweeters than any other state. Seven top users are from Michigan, and the top user is from Indiana. One may conclude that the programs from which these users come are those that have a stronger focus on computers and writing and that encourage more their scholars to establish digital presence.</p><p>In addition to the machine reading we performed with our project website, we also performed a close reading of 600 tweets that give a qualitative view of the content of the thousands of tweets surrounding the conference. Several compelling patterns emerged. In addition to the kinds of posts one would expect to see from social media--pictures of meals or jokes about dorm rooms--there are tweets that clearly move the work of the field forward by soliciting community-building acts, allowing for the participating of distant scholars, and deepening engagement with the academic content of the conference.</p><p>For example, in the hundreds of tweets we read carefully, we found tweets asking for the involvement of the conference community in fundraising actions or future research projects. @janicewalker tweets for help to support travel grant funds. @vrobin1000 shares the 2015 theme for the Computers and Writing conference. @alicedaer asks for attendees (and those following the hashtag) to contribute a GoogleDoc she is managing that lists journals and publications relevant to those working in computers and writing. The This Rhetorical Life podcast asks female scholars attending the conference to share their experiences as women in the field; this Twitter invitation (which was also issued on Facebook) later became an episode of the podcast. All of these tweets show the real scholarly work that is taking place on Twitter, work that is possible because of the public and digital nature of the platform.</p><figure><img src=\"/static/img/image5.png\" alt=\"Figure 5 Call for participation in podcast research project\"><p>Figure 5 Call for participation in podcast research project</p></figure><p>Other tweets showed the broad reach of the conference and the way the Twitter dialogue enabled distant scholars to participate in and follow the key conversations. @ag_scheg’s tweet was typical of many: “Happy to see all of the #cwcon tweets, but sorry I’m missing it #GoScholarGo #awesomness.” @saffista commented, “Someone should really be livestreaming Twitter for those of us who can’t be there. #cwcon.” The presence of these distant scholars appears not just in these tweets bemoaning their absence from the conference, but also in the ways they participate in conversations by following panels and retweeting the ideas and concepts that appeal to them. Chen Chen retweets this conversation between top tweeters @jzinchuk and @rutheioo: “hashtags are important for online community building @ruthieoo #cwcon #d6.” The tweets and retweets show in real time which ideas are compelling to scholars who can then retweet them or continue the conversation about them. In future iterations of this project, we would like to create time lapsed heat maps showing the ebb and flow of these ideas. The participation of distant scholars is a key point for future investigation. It is also interesting to note that neither Colin Brooke nor Chris Lindgren, the PhD student at University of Minnesota who also visualized the data, actually attended the conference. Despite/because of their absence, they were still participating in the conference by archiving the tweets and working with them. Neither of us were at the conference either, but as we perform our analysis of the tweets, we also are participating in the conference and its key conversations, months after these conversations actually took place.</p><p>In addition to allowing distant scholars to participate, the use of Twitter also helped manage issues of physical space for those present at the conference. Even scholars physically present at the conference are unable to attend every panel, but they can follow the tweets of sessions they do not attend or read the summaries panelists post about their sessions in order to make decisions about which conversations to join. @DCoad tweeted, “Love how everyone’s describing their sessions on Twitter; helps my decision-making process! #cwcon.” Other users posted links to summaries or other materials from their presentations. This demonstrates how the knowledge disseminated in the physical space of a particular panel can have a wider audience and impact once shared digitally.</p><p>Many of the tweets show the academic engagement occurring on Twitter about conference panel presentations, with scholars tweeting out questions and comments about the panels that they attended, thus continuing the conversations of the sessions beyond the time and space boundaries of the physical site and schedule of the conference itself. The following tweets give an example of how this happens:</p><blockquote>@Jenae_Cohn: #cwcon includes a lot of debates about whether we are or are not #dh. But does this even matter? I agree with @WallsDouglas; it doesn't #e3 @linzharding: Wonder how we can use auto revision assistant design and dev to help teach peer review? #cwcon #h7 @LightSideLabs @GraphicsTeacher: great point made that even virtual spaces are material spaces, but are \"distributed\" material spaces! #h6 #cwcon</blockquote><p>Several tweets from the archive also show the emerging importance of Twitter as a tool for professionalization. @vymanivannan, the fifth most frequent user of the conference, tweeting a total of 234 times in the archive, tweeted: “Noticing yet again how my Twitter presence revives solely for #cwcon… oh #cwcon, I only live for you.” The fact that @vymanivannan only uses Twitter during the conference demonstrates how the use of Twitter has become tied to the conference experience. In a way, it combines the traditional uses of LinkedIn and Facebook: professionalization and socializing. Twitter can create a sense of social community by tweeting jokes about karaoke and key notes as well as recruiting participation in research or continuing serious discussions from panels. It is not just people who love Twitter and who tweet all of their experiences who use Twitter when they attend an academic conference. Some users equate Twitter with the conference experience and use it only then, demonstrating how Twitter is a platform for professional and disciplinary development in the field of rhetoric and composition.</p><p>This project serves as a prototype of the Twitter analysis that we plan to do in the future. Using this website, we will continue to process Twitter data from other conferences in the field of rhetoric and composition and study them in different ways. We hope to expand the functionality of the website to include the analysis of other kinds of data: heat maps that show the popularity of topics rising and falling over the days of the conference and maps that track the locations from which the tweets are sent. Then, we will be able to learn how many users are participating in the conference solely through the Twitter platform, thus further contributing to our arguments. Our next project is to build our own tweet archive for CCCC in 2015 and perform these analyses on it. We plan to present our work at the Annual English Graduate Student Conference at NC State and CWCON2015. We have submitted proposals to each of these conferences. Ultimately, we would also like to publish our project in Kairos.</p><h3>Reference List</h3><citation>Brooke, C. (2014, March 18). The work of conferences in an age of social media. [Web log post]. Retrieved from <a href=\"http://www.cgbrooke.net/2014/03/18/the-work-of-conferences-in-an-age-of-social-media-4c14/\">http://www.cgbrooke.net/2014/03/18/the-work-of-conferences-in-an-age-of-social-media-4c14/</a></citation><citation>Brooke, C. (2014). #cwcon. Retrived from <a href=\"http://www.tweetarchivist.com/cgbrooke/2\">http://www.tweetarchivist.com/cgbrooke/2</a></citation><citation>Computers and Writing Memorabilia Project. Retrieved from <a href=\"http://computersandwriting.org/memorabilia/\">http://computersandwriting.org/memorabilia/</a></citation><citation>Ett, L. V. &amp; Gonzales, L. (2013, November 25). Hey, we’re trending! but, what are we saying?: analyzing digital conversations from 2013 #cwcon. [Web log post]. Retrieved from <a href=\"http://www.digitalrhetoriccollaborative.org/2013/11/25/hey-were-trending-but-what-are-we-saying-analyzing-digital-conversations-from-2013-cwcon/\">http://www.digitalrhetoriccollaborative.org/2013/11/25/hey-were-trending-but-what-are-we-saying-analyzing-digital-conversations-from-2013-cwcon/</a></citation><citation>Gibson, W. (2010, August 31). Google’s Earth. The New York Times. Retrieved from <a href=\"http://www.nytimes.com/2010/09/01/opinion/01gibson.html?_r=1&\">http://www.nytimes.com/2010/09/01/opinion/01gibson.html?_r=1&amp;</a></citation><citation>Hayles, N. K. (2012). How we think: Digital media and contemporary technogenesis. Chicago, IL: The University of Chicago Press.</citation><citation>Johnson-Eilola, Johndan. Datacloud: toward a new theory of online work. Cresskill, New Jersey: Hampton Press.</citation><citation>Jones, S. E. (2014). The emergence of the digital humanities. New York, NY: Routledge.</citation><citation>Latour, B. (2005). Reassembling the social: An introduction to actor-network-theory. New York, NY: Oxford University Press.</citation><citation>Lindgren, C. (2014). [2014 Computers &amp; Writing (#CWCON14) Twitter Visualizations] Retrieved from <a href=\"http://www.clindgrencv.com/cwcon14.html\">http://www.clindgrencv.com/cwcon14.html</a></citation><citation>Kaptelinin, V., &amp; Nardi, B. A. (2006). Acting with technology: Activity theory and interaction design. Cambridge, MA: The MIT Press.</citation><citation>Spinuzzi, C. (2008). Network. New York, NY: Cambridge University Press.</citation></div>"
  );


  $templateCache.put('home',
    "<div class=\"applets-home\"><div class=\"alert alert-danger alert-dismissible\" ng-show=\"error\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span> <span class=\"sr-only\">Close</span></button> {{error}}</div><div class=\"narrow\"><div class=\"form-group\"><select class=\"form-control\" ng-model=\"filetype\" ng-value=\"byuser\"><option value=\"bytweet\">Upload Tweet Excel File</option><option value=\"byuser\">Upload Top Tweeter Excel File</option></select></div><div id=\"dropzone\" up-dropzone up-dropclass=\"dropzone-cover\" up-ondrop=\"capture\" class=\"well drop-zone\">Drag a file here or click to upload.</div></div><div class=\"data\"><div class=\"well\" ng-repeat=\"chart in charts\"><h3>{{chart.title}}</h3><div google-chart chart=\"chart\"></div></div></div></div>"
  );


  $templateCache.put('layout',
    "<div class=\"wrapper\"><div class=\"menu\"><a ng-repeat=\"place in places\" class=\"item\" ng-class=\"{selected: place.selected}\" ng-href=\"{{place.url}}\">{{place.link}}</a></div><div class=\"content\"><div class=\"page-header\"><h1>{{title}}</h1></div><div ng-view=\"'home'\"></div><div class=\"footer\"><!-- legalese. --></div></div></div>"
  );

}]);
