export function initDraftRoom(){

const PLAYERS = [{"rank":1,"name":"Nikola Jokić","pos":"C","team":"Denver Nuggets","tier":1,"exp":80,"ceil":82,"flags":[],"note":""},{"rank":2,"name":"Victor Wembanyama","pos":"C","team":"San Antonio Spurs","tier":1,"exp":74,"ceil":82,"flags":["ast","blk"],"note":""},{"rank":3,"name":"Shai Gilgeous-Alexander","pos":"G","team":"Oklahoma City Thunder","tier":1,"exp":70,"ceil":82,"flags":[],"note":""},{"rank":4,"name":"Luka Dončić","pos":"G","team":"Los Angeles Lakers","tier":2,"exp":65,"ceil":66,"flags":["to"],"note":""},{"rank":5,"name":"Cade Cunningham","pos":"G","team":"Detroit Pistons","tier":2,"exp":62,"ceil":66,"flags":["to"],"note":""},{"rank":6,"name":"Jayson Tatum","pos":"F","team":"Boston Celtics","tier":2,"exp":45,"ceil":45,"flags":["bust"],"note":"Muse: overpriced above $45."},{"rank":7,"name":"Jalen Johnson","pos":"F","team":"Atlanta Hawks","tier":2,"exp":56,"ceil":64,"flags":[],"note":""},{"rank":8,"name":"Cooper Flagg","pos":"F","team":"Dallas Mavericks","tier":2,"exp":34,"ceil":38,"flags":[],"note":"Rookie-year-two price risk; panel split."},{"rank":9,"name":"Anthony Edwards","pos":"G","team":"Minnesota Timberwolves","tier":2,"exp":52,"ceil":60,"flags":["to"],"note":""},{"rank":10,"name":"Giannis Antetokounmpo","pos":"F","team":"Miami Heat","tier":2,"exp":45,"ceil":55,"flags":["ft"],"note":"FT-punt build only ($45); otherwise $32/$36."},{"rank":11,"name":"Scottie Barnes","pos":"F/C","team":"Toronto Raptors","tier":3,"exp":48,"ceil":49,"flags":[],"note":""},{"rank":12,"name":"Tyrese Maxey","pos":"G","team":"Philadelphia 76ers","tier":3,"exp":42,"ceil":48,"flags":["bust"],"note":""},{"rank":13,"name":"Donovan Mitchell","pos":"G","team":"Cleveland Cavaliers","tier":3,"exp":45,"ceil":49,"flags":[],"note":""},{"rank":14,"name":"Kevin Durant","pos":"G/F","team":"Houston Rockets","tier":3,"exp":44,"ceil":49,"flags":[],"note":""},{"rank":15,"name":"Karl-Anthony Towns","pos":"C","team":"New York Knicks","tier":3,"exp":43,"ceil":48,"flags":[],"note":""},{"rank":16,"name":"Stephen Curry","pos":"G","team":"Golden State Warriors","tier":3,"exp":38,"ceil":44,"flags":["bust"],"note":""},{"rank":17,"name":"Tyrese Haliburton","pos":"G","team":"Indiana Pacers","tier":3,"exp":32,"ceil":36,"flags":["bust","injury"],"note":"Achilles return; ankle tweak (MRI clean). All 3 panel lanes: overpriced. Ankle tweak, MRI clean."},{"rank":18,"name":"Austin Reaves","pos":"G","team":"Los Angeles Lakers","tier":3,"exp":40,"ceil":46,"flags":[],"note":""},{"rank":19,"name":"Amen Thompson","pos":"G/F","team":"Houston Rockets","tier":3,"exp":39,"ceil":44,"flags":["ft","stl"],"note":""},{"rank":20,"name":"Jamal Murray","pos":"G","team":"Denver Nuggets","tier":3,"exp":38,"ceil":44,"flags":[],"note":""},{"rank":21,"name":"LaMelo Ball","pos":"G","team":"Minnesota Timberwolves","tier":4,"exp":37,"ceil":37,"flags":["to"],"note":""},{"rank":22,"name":"Alperen Şengün","pos":"C","team":"Houston Rockets","tier":4,"exp":36,"ceil":37,"flags":[],"note":""},{"rank":23,"name":"Anthony Davis","pos":"F/C","team":"Washington Wizards","tier":4,"exp":19,"ceil":25,"flags":[],"note":"20 games last season."},{"rank":24,"name":"Trae Young","pos":"G","team":"Washington Wizards","tier":4,"exp":34,"ceil":37,"flags":["to"],"note":""},{"rank":25,"name":"Trey Murphy","pos":"G/F","team":"New Orleans Pelicans","tier":4,"exp":34,"ceil":37,"flags":[],"note":""},{"rank":26,"name":"Josh Giddey","pos":"G","team":"Chicago Bulls","tier":4,"exp":33,"ceil":36,"flags":[],"note":""},{"rank":27,"name":"Lauri Markkanen","pos":"F","team":"Utah Jazz","tier":4,"exp":32,"ceil":36,"flags":[],"note":""},{"rank":28,"name":"Chet Holmgren","pos":"F/C","team":"Oklahoma City Thunder","tier":4,"exp":31,"ceil":34,"flags":["ast","blk"],"note":""},{"rank":29,"name":"Evan Mobley","pos":"F/C","team":"Cleveland Cavaliers","tier":4,"exp":31,"ceil":34,"flags":["blk"],"note":""},{"rank":30,"name":"Kawhi Leonard","pos":"F","team":"Toronto Raptors","tier":4,"exp":23,"ceil":28,"flags":[],"note":"Availability discount."},{"rank":31,"name":"Brandon Miller","pos":"G/F","team":"Charlotte Hornets","tier":5,"exp":29,"ceil":29,"flags":[],"note":""},{"rank":32,"name":"James Harden","pos":"G","team":"Cleveland Cavaliers","tier":5,"exp":29,"ceil":29,"flags":[],"note":""},{"rank":33,"name":"Jalen Williams","pos":"F","team":"Oklahoma City Thunder","tier":5,"exp":28,"ceil":29,"flags":[],"note":""},{"rank":34,"name":"Devin Booker","pos":"G","team":"Phoenix Suns","tier":5,"exp":25,"ceil":28,"flags":["bust"],"note":""},{"rank":35,"name":"Domantas Sabonis","pos":"C","team":"Sacramento Kings","tier":5,"exp":27,"ceil":29,"flags":[],"note":""},{"rank":36,"name":"Bam Adebayo","pos":"C","team":"Miami Heat","tier":5,"exp":27,"ceil":29,"flags":[],"note":""},{"rank":37,"name":"Jaren Jackson Jr.","pos":"F/C","team":"Utah Jazz","tier":5,"exp":26,"ceil":29,"flags":[],"note":""},{"rank":38,"name":"Deni Avdija","pos":"G/F","team":"Portland Trail Blazers","tier":5,"exp":25,"ceil":28,"flags":[],"note":""},{"rank":39,"name":"Walker Kessler","pos":"C","team":"Los Angeles Lakers","tier":5,"exp":25,"ceil":28,"flags":["ft","blk"],"note":""},{"rank":40,"name":"Derrick White","pos":"G","team":"Boston Celtics","tier":5,"exp":22,"ceil":27,"flags":["sleeper"],"note":"Guard blocks and threes."},{"rank":41,"name":"Jalen Brunson","pos":"G","team":"New York Knicks","tier":5,"exp":24,"ceil":28,"flags":[],"note":""},{"rank":42,"name":"Kyrie Irving","pos":"G","team":"Dallas Mavericks","tier":5,"exp":12,"ceil":18,"flags":["injury"],"note":"ACL return."},{"rank":43,"name":"Matas Buzelis","pos":"F","team":"Chicago Bulls","tier":5,"exp":23,"ceil":26,"flags":[],"note":""},{"rank":44,"name":"Jaylen Brown","pos":"G/F","team":"Philadelphia 76ers","tier":5,"exp":23,"ceil":26,"flags":[],"note":""},{"rank":45,"name":"Franz Wagner","pos":"F","team":"Orlando Magic","tier":5,"exp":22,"ceil":26,"flags":[],"note":""},{"rank":46,"name":"Jalen Duren","pos":"C","team":"Detroit Pistons","tier":6,"exp":22,"ceil":22,"flags":[],"note":""},{"rank":47,"name":"LeBron James","pos":"F","team":"Philadelphia 76ers","tier":6,"exp":14,"ceil":19,"flags":["bust","injury"],"note":"Foot arthritis, age 42. Foot arthritis."},{"rank":48,"name":"OG Anunoby","pos":"F","team":"New York Knicks","tier":6,"exp":17,"ceil":21,"flags":["sleeper"],"note":"Efficient defensive production."},{"rank":49,"name":"Desmond Bane","pos":"G/F","team":"Orlando Magic","tier":6,"exp":21,"ceil":22,"flags":[],"note":""},{"rank":50,"name":"Donovan Clingan","pos":"C","team":"Portland Trail Blazers","tier":6,"exp":20,"ceil":22,"flags":["ft","ast","blk"],"note":""},{"rank":51,"name":"Pascal Siakam","pos":"F","team":"Indiana Pacers","tier":6,"exp":20,"ceil":22,"flags":[],"note":""},{"rank":52,"name":"Nickeil Alexander-Walker","pos":"G","team":"Atlanta Hawks","tier":6,"exp":20,"ceil":22,"flags":[],"note":""},{"rank":53,"name":"Darius Garland","pos":"G","team":"LA Clippers","tier":6,"exp":19,"ceil":22,"flags":[],"note":""},{"rank":54,"name":"Onyeka Okongwu","pos":"C","team":"Atlanta Hawks","tier":6,"exp":19,"ceil":22,"flags":["blk"],"note":""},{"rank":55,"name":"Zach Edey","pos":"C","team":"Memphis Grizzlies","tier":6,"exp":19,"ceil":22,"flags":[],"note":""},{"rank":56,"name":"Dejounte Murray","pos":"G","team":"New Orleans Pelicans","tier":6,"exp":14,"ceil":18,"flags":["injury"],"note":"Toe contusion - check status. Toe contusion."},{"rank":57,"name":"Michael Porter Jr.","pos":"F","team":"Brooklyn Nets","tier":6,"exp":18,"ceil":22,"flags":[],"note":""},{"rank":58,"name":"Paolo Banchero","pos":"F","team":"Orlando Magic","tier":6,"exp":17,"ceil":17,"flags":["bust"],"note":"Low efficiency, thin D stats."},{"rank":59,"name":"Keyonte George","pos":"G","team":"Utah Jazz","tier":6,"exp":17,"ceil":20,"flags":[],"note":""},{"rank":60,"name":"Tyler Herro","pos":"G","team":"Milwaukee Bucks","tier":6,"exp":17,"ceil":20,"flags":[],"note":""},{"rank":61,"name":"Kon Knueppel","pos":"G/F","team":"Charlotte Hornets","tier":6,"exp":17,"ceil":20,"flags":["injury"],"note":"Hamstring."},{"rank":62,"name":"Ivica Zubac","pos":"C","team":"Indiana Pacers","tier":6,"exp":16,"ceil":20,"flags":[],"note":""},{"rank":63,"name":"Ryan Rollins","pos":"G","team":"Milwaukee Bucks","tier":6,"exp":16,"ceil":20,"flags":[],"note":""},{"rank":64,"name":"Cameron Boozer","pos":"F","team":"Memphis Grizzlies","tier":6,"exp":16,"ceil":20,"flags":[],"note":""},{"rank":65,"name":"Stephon Castle","pos":"G","team":"San Antonio Spurs","tier":6,"exp":16,"ceil":20,"flags":[],"note":""},{"rank":66,"name":"Dyson Daniels","pos":"G/F","team":"Atlanta Hawks","tier":7,"exp":12,"ceil":14,"flags":["sleeper","ft","stl"],"note":"STL, FT% drag."},{"rank":67,"name":"Joel Embiid","pos":"C","team":"Philadelphia 76ers","tier":7,"exp":10,"ceil":15,"flags":["bust","to"],"note":"Maintenance, reduced role."},{"rank":68,"name":"Ausar Thompson","pos":"G/F","team":"Detroit Pistons","tier":7,"exp":8,"ceil":11,"flags":["sleeper","stl"],"note":"STL/BLK from a wing."},{"rank":69,"name":"Damian Lillard","pos":"G","team":"Portland Trail Blazers","tier":7,"exp":14,"ceil":15,"flags":[],"note":""},{"rank":70,"name":"Naz Reid","pos":"F/C","team":"Charlotte Hornets","tier":7,"exp":12,"ceil":16,"flags":["sleeper"],"note":"Expanded role."},{"rank":71,"name":"Kel'el Ware","pos":"C","team":"Milwaukee Bucks","tier":7,"exp":9,"ceil":14,"flags":["sleeper","blk"],"note":"BLK/REB upside; panel range $6-12."},{"rank":72,"name":"Julius Randle","pos":"F","team":"Brooklyn Nets","tier":7,"exp":14,"ceil":15,"flags":[],"note":""},{"rank":73,"name":"Jaden McDaniels","pos":"F","team":"Minnesota Timberwolves","tier":7,"exp":13,"ceil":15,"flags":["stl"],"note":""},{"rank":74,"name":"Neemias Queta","pos":"C","team":"Boston Celtics","tier":7,"exp":2,"ceil":4,"flags":["bust"],"note":"Timeshare; guide would pay $1-3."},{"rank":75,"name":"De'Aaron Fox","pos":"G","team":"San Antonio Spurs","tier":7,"exp":13,"ceil":15,"flags":[],"note":""},{"rank":76,"name":"Cason Wallace","pos":"G","team":"Oklahoma City Thunder","tier":7,"exp":3,"ceil":5,"flags":["sleeper","stl"],"note":"Steals at near-$1 price."},{"rank":77,"name":"Rudy Gobert","pos":"C","team":"Minnesota Timberwolves","tier":7,"exp":12,"ceil":14,"flags":["ft"],"note":""},{"rank":78,"name":"Isaiah Hartenstein","pos":"C","team":"Oklahoma City Thunder","tier":7,"exp":12,"ceil":14,"flags":[],"note":""},{"rank":79,"name":"Alex Sarr","pos":"C","team":"Washington Wizards","tier":7,"exp":12,"ceil":14,"flags":[],"note":""},{"rank":80,"name":"Keegan Murray","pos":"F","team":"Sacramento Kings","tier":7,"exp":12,"ceil":14,"flags":[],"note":""},{"rank":81,"name":"Fred VanVleet","pos":"G","team":"Houston Rockets","tier":7,"exp":11,"ceil":14,"flags":[],"note":""},{"rank":82,"name":"Zion Williamson","pos":"F","team":"New Orleans Pelicans","tier":7,"exp":11,"ceil":14,"flags":[],"note":""},{"rank":83,"name":"Coby White","pos":"G","team":"Charlotte Hornets","tier":7,"exp":11,"ceil":14,"flags":["injury"],"note":"Calf."},{"rank":84,"name":"Paul George","pos":"F","team":"Boston Celtics","tier":7,"exp":11,"ceil":14,"flags":[],"note":""},{"rank":85,"name":"Immanuel Quickley","pos":"G","team":"Toronto Raptors","tier":7,"exp":11,"ceil":14,"flags":[],"note":""},{"rank":86,"name":"VJ Edgecombe","pos":"G","team":"Philadelphia 76ers","tier":7,"exp":10,"ceil":12,"flags":[],"note":""},{"rank":87,"name":"Jarrett Allen","pos":"C","team":"Cleveland Cavaliers","tier":7,"exp":10,"ceil":12,"flags":[],"note":""},{"rank":88,"name":"Jalen Suggs","pos":"G","team":"Orlando Magic","tier":7,"exp":10,"ceil":12,"flags":[],"note":""},{"rank":89,"name":"Mikal Bridges","pos":"G/F","team":"New York Knicks","tier":7,"exp":10,"ceil":12,"flags":[],"note":""},{"rank":90,"name":"Zach LaVine","pos":"G/F","team":"Sacramento Kings","tier":7,"exp":10,"ceil":12,"flags":[],"note":""},{"rank":91,"name":"Ty Jerome","pos":"G","team":"Memphis Grizzlies","tier":8,"exp":9,"ceil":9,"flags":[],"note":""},{"rank":92,"name":"Norman Powell","pos":"G/F","team":"Chicago Bulls","tier":8,"exp":9,"ceil":9,"flags":[],"note":""},{"rank":93,"name":"Andrew Wiggins","pos":"F","team":"Miami Heat","tier":8,"exp":9,"ceil":9,"flags":[],"note":""},{"rank":94,"name":"Collin Murray-Boyles","pos":"F/C","team":"Toronto Raptors","tier":8,"exp":6,"ceil":9,"flags":["sleeper"],"note":"Late-round upside."},{"rank":95,"name":"Josh Hart","pos":"G/F","team":"New York Knicks","tier":8,"exp":8,"ceil":11,"flags":["sleeper"],"note":"REB/AST for a wing."},{"rank":96,"name":"Day'Ron Sharpe","pos":"C","team":"Brooklyn Nets","tier":8,"exp":9,"ceil":9,"flags":["injury"],"note":"Meniscus, back late Feb/Mar."},{"rank":97,"name":"Dylan Harper","pos":"G","team":"San Antonio Spurs","tier":8,"exp":8,"ceil":9,"flags":[],"note":""},{"rank":98,"name":"Jabari Smith Jr.","pos":"F/C","team":"Houston Rockets","tier":8,"exp":8,"ceil":9,"flags":[],"note":""},{"rank":99,"name":"John Collins","pos":"F/C","team":"Detroit Pistons","tier":8,"exp":8,"ceil":9,"flags":[],"note":""},{"rank":100,"name":"Brandin Podziemski","pos":"G","team":"Golden State Warriors","tier":8,"exp":8,"ceil":9,"flags":[],"note":""},{"rank":101,"name":"CJ McCollum","pos":"G","team":"Atlanta Hawks","tier":8,"exp":8,"ceil":9,"flags":[],"note":""},{"rank":102,"name":"Myles Turner","pos":"C","team":"Milwaukee Bucks","tier":8,"exp":8,"ceil":9,"flags":[],"note":""},{"rank":103,"name":"Brandon Ingram","pos":"F","team":"LA Clippers","tier":8,"exp":8,"ceil":9,"flags":["injury"],"note":"Partial Achilles tear."},{"rank":104,"name":"Miles Bridges","pos":"F","team":"Phoenix Suns","tier":8,"exp":7,"ceil":8,"flags":[],"note":""},{"rank":105,"name":"Caleb Wilson","pos":"F","team":"Chicago Bulls","tier":8,"exp":7,"ceil":8,"flags":[],"note":""},{"rank":106,"name":"Ayo Dosunmu","pos":"G","team":"Minnesota Timberwolves","tier":8,"exp":7,"ceil":8,"flags":[],"note":""},{"rank":107,"name":"Cedric Coward","pos":"G/F","team":"Memphis Grizzlies","tier":8,"exp":7,"ceil":8,"flags":[],"note":""},{"rank":108,"name":"Reed Sheppard","pos":"G","team":"Houston Rockets","tier":8,"exp":7,"ceil":8,"flags":[],"note":""},{"rank":109,"name":"Kristaps Porziņǵis","pos":"F/C","team":"Golden State Warriors","tier":8,"exp":7,"ceil":8,"flags":[],"note":""},{"rank":110,"name":"Mitchell Robinson","pos":"C","team":"Boston Celtics","tier":8,"exp":7,"ceil":8,"flags":[],"note":""},{"rank":111,"name":"Ja Morant","pos":"G","team":"Portland Trail Blazers","tier":8,"exp":8,"ceil":11,"flags":["bust"],"note":"Role and availability risk."},{"rank":112,"name":"Nic Claxton","pos":"C","team":"Chicago Bulls","tier":8,"exp":6,"ceil":8,"flags":["injury"],"note":"Hamstring."},{"rank":113,"name":"Robert Williams III","pos":"C","team":"Portland Trail Blazers","tier":8,"exp":6,"ceil":8,"flags":[],"note":""},{"rank":114,"name":"Khaman Maluach","pos":"C","team":"Phoenix Suns","tier":8,"exp":6,"ceil":8,"flags":[],"note":""},{"rank":115,"name":"Paul Reed","pos":"C","team":"Detroit Pistons","tier":8,"exp":6,"ceil":8,"flags":[],"note":""},{"rank":116,"name":"Yaxel Lendeborg","pos":"F","team":"Golden State Warriors","tier":8,"exp":6,"ceil":8,"flags":[],"note":""},{"rank":117,"name":"Derik Queen","pos":"F/C","team":"New Orleans Pelicans","tier":8,"exp":6,"ceil":8,"flags":[],"note":""},{"rank":118,"name":"Christian Braun","pos":"G/F","team":"Denver Nuggets","tier":8,"exp":6,"ceil":8,"flags":[],"note":""},{"rank":119,"name":"Anthony Black","pos":"G","team":"Orlando Magic","tier":8,"exp":6,"ceil":8,"flags":[],"note":""},{"rank":120,"name":"Tobias Harris","pos":"F","team":"San Antonio Spurs","tier":8,"exp":6,"ceil":8,"flags":[],"note":""},{"rank":121,"name":"Ajay Mitchell","pos":"G","team":"Oklahoma City Thunder","tier":9,"exp":5,"ceil":8,"flags":["sleeper"],"note":"Bigger role."},{"rank":122,"name":"Cameron Johnson","pos":"G/F","team":"Denver Nuggets","tier":9,"exp":5,"ceil":5,"flags":[],"note":""},{"rank":123,"name":"Payton Pritchard","pos":"G","team":"Boston Celtics","tier":9,"exp":5,"ceil":5,"flags":[],"note":""},{"rank":124,"name":"Jakob Poeltl","pos":"C","team":"Toronto Raptors","tier":9,"exp":5,"ceil":5,"flags":[],"note":""},{"rank":125,"name":"Toumani Camara","pos":"F","team":"Portland Trail Blazers","tier":9,"exp":5.0,"ceil":5,"flags":[],"note":""},{"rank":126,"name":"Jalen Green","pos":"G/F","team":"Phoenix Suns","tier":9,"exp":5.0,"ceil":5,"flags":[],"note":""},{"rank":127,"name":"Isaiah Jackson","pos":"C","team":"LA Clippers","tier":9,"exp":5.0,"ceil":5,"flags":[],"note":""},{"rank":128,"name":"Aaron Nesmith","pos":"G/F","team":"Indiana Pacers","tier":9,"exp":4.5,"ceil":5,"flags":[],"note":""},{"rank":129,"name":"Moussa Diabaté","pos":"C","team":"Charlotte Hornets","tier":9,"exp":4.5,"ceil":5,"flags":[],"note":""},{"rank":130,"name":"Tre Jones","pos":"G","team":"Chicago Bulls","tier":9,"exp":4.5,"ceil":5,"flags":[],"note":""},{"rank":131,"name":"Egor Dëmin","pos":"G","team":"Brooklyn Nets","tier":9,"exp":4.5,"ceil":5,"flags":[],"note":""},{"rank":132,"name":"Peyton Watson","pos":"F","team":"Cleveland Cavaliers","tier":9,"exp":4.5,"ceil":5,"flags":[],"note":""},{"rank":133,"name":"Kyshawn George","pos":"G/F","team":"Washington Wizards","tier":9,"exp":4.0,"ceil":5,"flags":[],"note":""},{"rank":134,"name":"Jeremiah Fears","pos":"G","team":"New Orleans Pelicans","tier":9,"exp":4.0,"ceil":5,"flags":[],"note":""},{"rank":135,"name":"Jrue Holiday","pos":"G","team":"Portland Trail Blazers","tier":9,"exp":4.0,"ceil":5,"flags":[],"note":""},{"rank":136,"name":"DeMar DeRozan","pos":"F","team":"Denver Nuggets","tier":9,"exp":4.0,"ceil":5,"flags":[],"note":""},{"rank":137,"name":"Gui Santos","pos":"F","team":"Golden State Warriors","tier":9,"exp":4.0,"ceil":5,"flags":[],"note":""},{"rank":138,"name":"Jaime Jaquez Jr.","pos":"G/F","team":"Milwaukee Bucks","tier":9,"exp":3.5,"ceil":4.5,"flags":[],"note":""},{"rank":139,"name":"Herb Jones","pos":"G/F","team":"New Orleans Pelicans","tier":9,"exp":3.5,"ceil":4.5,"flags":[],"note":""},{"rank":140,"name":"Davion Mitchell","pos":"G","team":"Miami Heat","tier":9,"exp":3.5,"ceil":4.5,"flags":[],"note":""},{"rank":141,"name":"Dereck Lively II","pos":"C","team":"Dallas Mavericks","tier":9,"exp":3.5,"ceil":4.5,"flags":[],"note":""},{"rank":142,"name":"Aaron Gordon","pos":"F","team":"Denver Nuggets","tier":9,"exp":3.5,"ceil":4.5,"flags":[],"note":""},{"rank":143,"name":"RJ Barrett","pos":"G/F","team":"Toronto Raptors","tier":9,"exp":3.5,"ceil":4.5,"flags":[],"note":""},{"rank":144,"name":"Rui Hachimura","pos":"F","team":"LA Clippers","tier":9,"exp":3.0,"ceil":4.0,"flags":[],"note":""},{"rank":145,"name":"Sandro Mamukelashvili","pos":"F/C","team":"Los Angeles Lakers","tier":9,"exp":3.0,"ceil":4.0,"flags":[],"note":""},{"rank":146,"name":"Tari Eason","pos":"F","team":"Houston Rockets","tier":9,"exp":3.0,"ceil":4.0,"flags":[],"note":""},{"rank":147,"name":"Grayson Allen","pos":"G/F","team":"Charlotte Hornets","tier":9,"exp":3.0,"ceil":4.0,"flags":[],"note":""},{"rank":148,"name":"AJ Dybantsa","pos":"F","team":"Washington Wizards","tier":9,"exp":3.0,"ceil":4.0,"flags":[],"note":""},{"rank":149,"name":"Daniel Gafford","pos":"C","team":"Dallas Mavericks","tier":9,"exp":3.0,"ceil":4.0,"flags":[],"note":""},{"rank":150,"name":"Scotty Pippen Jr.","pos":"G","team":"Memphis Grizzlies","tier":9,"exp":2.5,"ceil":3.5,"flags":[],"note":""},{"rank":151,"name":"Wendell Carter Jr.","pos":"C","team":"Orlando Magic","tier":10,"exp":2.5,"ceil":3,"flags":[],"note":""},{"rank":152,"name":"Derrick Jones Jr.","pos":"F","team":"LA Clippers","tier":10,"exp":2.5,"ceil":3,"flags":[],"note":""},{"rank":153,"name":"Devin Vassell","pos":"G/F","team":"San Antonio Spurs","tier":10,"exp":2.5,"ceil":3,"flags":[],"note":""},{"rank":154,"name":"Jusuf Nurkić","pos":"C","team":"Utah Jazz","tier":10,"exp":2.5,"ceil":3,"flags":["injury"],"note":"Out at least 4 weeks."},{"rank":155,"name":"Saddiq Bey","pos":"F","team":"New Orleans Pelicans","tier":10,"exp":2.5,"ceil":3,"flags":[],"note":""},{"rank":156,"name":"Nikola Vučević","pos":"C","team":"Orlando Magic","tier":10,"exp":2.5,"ceil":3,"flags":[],"note":""},{"rank":157,"name":"Kelly Oubre Jr.","pos":"G/F","team":"Indiana Pacers","tier":10,"exp":2.0,"ceil":2.5,"flags":[],"note":""},{"rank":158,"name":"Collin Gillespie","pos":"G","team":"Phoenix Suns","tier":10,"exp":2.0,"ceil":2.5,"flags":[],"note":""},{"rank":159,"name":"Kevin Porter Jr.","pos":"G","team":"Milwaukee Bucks","tier":10,"exp":2.0,"ceil":2.5,"flags":[],"note":""},{"rank":160,"name":"Julian Champagnie","pos":"F","team":"San Antonio Spurs","tier":10,"exp":2.0,"ceil":2.5,"flags":[],"note":""},{"rank":161,"name":"Jimmy Butler","pos":"F","team":"Golden State Warriors","tier":10,"exp":2.0,"ceil":2.5,"flags":[],"note":""},{"rank":162,"name":"Darryn Peterson","pos":"G","team":"Utah Jazz","tier":10,"exp":2.0,"ceil":2.5,"flags":[],"note":""},{"rank":163,"name":"Dillon Brooks","pos":"F","team":"Phoenix Suns","tier":10,"exp":2.0,"ceil":2.5,"flags":[],"note":""},{"rank":164,"name":"Quentin Grimes","pos":"G/F","team":"Los Angeles Lakers","tier":10,"exp":2.0,"ceil":2.5,"flags":[],"note":""},{"rank":165,"name":"Bobby Portis","pos":"F/C","team":"Miami Heat","tier":10,"exp":2.0,"ceil":2.5,"flags":[],"note":""},{"rank":166,"name":"PJ Washington","pos":"F/C","team":"Dallas Mavericks","tier":10,"exp":1.5,"ceil":2.0,"flags":[],"note":""},{"rank":167,"name":"Andrew Nembhard","pos":"G","team":"Indiana Pacers","tier":10,"exp":1.5,"ceil":2.0,"flags":[],"note":""},{"rank":168,"name":"Ja’Kobe Walter","pos":"G","team":"Toronto Raptors","tier":10,"exp":1.5,"ceil":2.0,"flags":[],"note":""},{"rank":169,"name":"Sam Merrill","pos":"G/F","team":"Cleveland Cavaliers","tier":10,"exp":1.5,"ceil":2.0,"flags":[],"note":""},{"rank":170,"name":"De’Anthony Melton","pos":"G","team":"Golden State Warriors","tier":10,"exp":1.5,"ceil":2.0,"flags":[],"note":""},{"rank":171,"name":"Maxime Raynaud","pos":"C","team":"Sacramento Kings","tier":10,"exp":1.5,"ceil":2.0,"flags":[],"note":""},{"rank":172,"name":"Keon Ellis","pos":"G","team":"Brooklyn Nets","tier":10,"exp":1.5,"ceil":2.0,"flags":[],"note":""},{"rank":173,"name":"Jonathan Kuminga","pos":"F","team":"Minnesota Timberwolves","tier":10,"exp":1.5,"ceil":2.0,"flags":[],"note":""},{"rank":174,"name":"Gary Payton II","pos":"G/F","team":"Golden State Warriors","tier":10,"exp":1.5,"ceil":2.0,"flags":[],"note":""},{"rank":175,"name":"Yves Missi","pos":"C","team":"New Orleans Pelicans","tier":10,"exp":1.5,"ceil":2.0,"flags":[],"note":""},{"rank":176,"name":"Ace Bailey","pos":"G/F","team":"Utah Jazz","tier":10,"exp":1.5,"ceil":2.0,"flags":[],"note":""},{"rank":177,"name":"Jalen Smith","pos":"F/C","team":"Chicago Bulls","tier":10,"exp":1.0,"ceil":2,"flags":[],"note":""},{"rank":178,"name":"Miles McBride","pos":"G","team":"New York Knicks","tier":10,"exp":1.0,"ceil":2,"flags":[],"note":""},{"rank":179,"name":"Brook Lopez","pos":"C","team":"LA Clippers","tier":10,"exp":1.0,"ceil":2,"flags":[],"note":""},{"rank":180,"name":"Isaiah Stewart","pos":"F/C","team":"Memphis Grizzlies","tier":10,"exp":1.0,"ceil":2,"flags":[],"note":""},{"rank":181,"name":"Morez Johnson Jr.","pos":"F/C","team":"Dallas Mavericks","tier":10,"exp":1.0,"ceil":2,"flags":[],"note":""},{"rank":182,"name":"Tristan da Silva","pos":"F","team":"Orlando Magic","tier":10,"exp":1.0,"ceil":2,"flags":[],"note":""}];
'use strict';
const LSKEY='bbauction26_v1';
const SLOTS=['PG','SG','G','SF','PF','F','C','C','UTIL','UTIL','BN','BN','BN'];
const POOL=14*200;
const CURVE_SUM=PLAYERS.reduce((s,p)=>s+p.exp,0);
const TIER_TOP={1:80,2:66,3:49,4:37,5:29,6:22,7:15,8:9,9:5,10:2};

let state=load();
window.__draftLoad=function(j){try{const d=JSON.parse(j);if(d&&d.teams&&d.picks){state=d;save();render();}}catch(e){}};
function load(){
  try{const s=JSON.parse(localStorage.getItem(LSKEY));if(s&&s.teams&&s.picks)return s;}catch(e){}
  return {teams:Array.from({length:14},(_,i)=>({name:'Team '+(i+1)})),myTeam:0,picks:[],punt:'none',custom:[]};
}
function save(){const j=JSON.stringify(state);try{localStorage.setItem(LSKEY,j);}catch(e){}try{if(window.__drs)window.__drs.save(j);}catch(e){}}
function allPlayers(){return PLAYERS.concat(state.custom||[]);}
function byIdx(i){const a=allPlayers();return a[i];}
// picks: {p:idx, t:teamIdx, pr:price, ts}
function takenMap(){const m={};state.picks.forEach((pk,i)=>m[pk.p]=i);return m;}
function teamStats(){
  const st=state.teams.map(()=>({spent:0,count:0,players:[]}));
  state.picks.forEach(pk=>{const s=st[pk.t];s.spent+=pk.pr;s.count++;s.players.push(pk);});
  st.forEach(s=>{s.left=200-s.spent;});
  return st;
}
function slotElig(pos){
  const G=['PG','SG','G'],F=['SF','PF','F'],C=['C'];
  if(pos==='G')return [G,['UTIL'],['BN']];
  if(pos==='F')return [F,['UTIL'],['BN']];
  if(pos==='C')return [C,['UTIL'],['BN']];
  if(pos==='G/F')return [G,F,['UTIL'],['BN']];
  if(pos==='F/C')return [F,C,['UTIL'],['BN']];
  return [['UTIL'],['BN']];
}
function assignSlots(teamIdx){
  // returns array of {slot, pick|null} length 13
  const st=teamStats()[teamIdx];
  const res=SLOTS.map(s=>({slot:s,pick:null}));
  const used=new Array(13).fill(false);
  const prefs={PG:0,SG:1,G:2,SF:3,PF:4,F:5,C:6,UTIL:10,BN:12};
  const pks=st.players.slice().sort((a,b)=>byIdx(a.p).pos.length-byIdx(b.p).pos.length);
  pks.forEach(pk=>{
    const groups=slotElig(byIdx(pk.p).pos);
    outer:
    for(const g of groups){
      // preferred slot names in group, in SLOTS order
      for(let i=0;i<13;i++){
        if(!used[i]&&g.includes(SLOTS[i])){used[i]=true;res[i].pick=pk;break outer;}
      }
    }
  });
  return res;
}
function openSlots(teamIdx){return 13-teamStats()[teamIdx].count;}
function maxBid(teamIdx){const s=teamStats()[teamIdx];return s.left-openSlots(teamIdx);}
function inflation(){
  const taken=takenMap();
  const open=182-state.picks.length;
  const totalLeft=POOL-state.picks.reduce((s,pk)=>s+pk.pr,0);
  const discreLeft=Math.max(0,totalLeft-open);
  const remCurve=allPlayers().reduce((s,p,i)=>(taken[i]!==undefined||p.exp<=2)?s:s+(p.exp-1),0);
  const f=remCurve>0?discreLeft/remCurve:1;
  return {f,remCurve,totalLeft};
}
const F0=(function(){const dl=POOL-182;const rc=PLAYERS.reduce((s,p)=>p.exp<=2?s:s+(p.exp-1),0);return dl/rc;})();
function mktFactor(){return inflation().f/F0;}
function adjExp(p){const f=mktFactor();return p.exp>2?Math.max(2,Math.round((p.exp-1)*f)+1):p.exp;}
function adjCeil(p){return p.ceil;} // panel consensus: ceilings never inflate
function fm$(v){return '$'+(Math.round(v*10)/10);}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function flagBadges(p,i){
  let b='';
  const taken=takenMap();
  if(p.flags.includes('sleeper'))b+='<span class="badge b-slp">VAL</span>';
  if(p.flags.includes('bust'))b+='<span class="badge b-bst">RISK</span>';
  if(p.flags.includes('injury'))b+='<span class="badge b-inj">INJ</span>';
  const pf=puntFits(p);if(pf)b+='<span class="badge b-punt">'+pf+'</span>';
  if(taken[i]===undefined&&state.picks.length>p.rank+20&&p.exp>=8)b+='<span class="badge b-fall">FALLING</span>';
  return b;
}
function puntFits(p){
  if(state.punt==='ft'&&p.flags.includes('ft'))return 'FT';
  if(state.punt==='to'&&p.flags.includes('to'))return 'TO';
  if(state.punt==='ast'&&p.flags.includes('ast'))return 'AST';
  if(state.punt==='blk'&&p.flags.includes('blk'))return 'BLK';
  return '';
}
/* ---------- header + tabs ---------- */
let curTab='board';
const TABS=[['board','Board','&#9776;'],['mine','My Team','&#9733;'],['teams','Teams','&#9786;'],['intel','Intel','&#9881;'],['log','Log','&#9998;']];
function renderHdr(){
  const st=teamStats()[state.myTeam],inf=inflation();
  const mb=maxBid(state.myTeam);
  document.getElementById('hdrStats').innerHTML=
    '<div class="stat"><div class="v mono">'+fm$(st.left)+'</div><div class="l">My $ left</div></div>'+
    '<div class="stat hi"><div class="v mono">'+fm$(Math.max(0,mb))+'</div><div class="l">Max bid</div></div>'+
    '<div class="stat"><div class="v mono">'+st.count+'/13</div><div class="l">Roster</div></div>'+
    '<div class="stat"><div class="v mono">'+mktFactor().toFixed(2)+'x</div><div class="l">Inflation</div></div>'+
    '<div class="stat"><div class="v mono">'+state.picks.length+'</div><div class="l">Picks</div></div>';
}
function renderTabs(){
  document.getElementById('tabs').innerHTML=TABS.map(t=>
    '<button data-tab="'+t[0]+'" class="'+(curTab===t[0]?'on':'')+'"><span class="ic">'+t[2]+'</span>'+t[1]+'</button>').join('');
  document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{curTab=b.dataset.tab;render();});
}
function render(){
  renderHdr();renderTabs();
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('on'));
  const el=document.getElementById('v-'+curTab);el.classList.add('on');
  ({board:renderBoard,mine:renderMine,teams:renderTeams,intel:renderIntel,log:renderLog})[curTab](el);
}

/* ---------- board ---------- */
let bq='',bf='all',bsort='rank';
function renderBoard(el){
  const chips=[['all','All'],['G','G'],['F','F'],['C','C'],['val','Values'],['punt','Punt fits'],['avail','Available']];
  el.innerHTML='<input id="search" placeholder="Search player..." value="'+esc(bq)+'">'+
    '<div class="chips">'+chips.map(c=>'<button class="chip'+(bf===c[0]?' on':'')+'" data-f="'+c[0]+'">'+c[1]+'</button>').join('')+
    '<button class="chip" id="addCustom">+ Not listed</button></div>'+
    '<div class="plist" id="plist"></div>';
  const si=el.querySelector('#search');
  si.oninput=()=>{bq=si.value;renderList();};
  el.querySelectorAll('.chip[data-f]').forEach(c=>c.onclick=()=>{bf=c.dataset.f;renderBoard(el);});
  el.querySelector('#addCustom').onclick=()=>customSheet();
  renderList();
}
function renderList(){
  const taken=takenMap();
  const q=bq.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let rows=allPlayers().map((p,i)=>({p,i}));
  if(q)rows=rows.filter(r=>r.p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q)||r.p.team.toLowerCase().includes(q));
  if(bf==='G')rows=rows.filter(r=>r.p.pos.includes('G'));
  if(bf==='F')rows=rows.filter(r=>r.p.pos[0]==='F'||r.p.pos.includes('/F')||r.p.pos==='F');
  if(bf==='C')rows=rows.filter(r=>r.p.pos.includes('C'));
  if(bf==='val')rows=rows.filter(r=>r.p.flags.includes('sleeper'));
  if(bf==='punt')rows=rows.filter(r=>puntFits(r.p));
  if(bf==='avail')rows=rows.filter(r=>taken[r.i]===undefined);
  if(!q&&bf==='all')rows=rows.slice().sort((a,b)=>{
    const ta=taken[a.i]!==undefined?1:0,tb=taken[b.i]!==undefined?1:0;
    return ta-tb||a.p.rank-b.p.rank;});
  const show=rows.slice(0,400);
  document.getElementById('plist').innerHTML=show.map(r=>{
    const p=r.p,t=taken[r.i]!==undefined;
    const pk=t?state.picks[taken[r.i]]:null;
    return '<div class="prow'+(t?' taken':'')+'" data-i="'+r.i+'">'+
      '<div class="rk mono">'+p.rank+'</div>'+
      '<div class="nm"><div class="n">'+esc(p.name)+flagBadges(p,r.i)+'</div>'+
      '<div class="s">'+p.pos+' &middot; '+esc(p.team)+' &middot; T'+p.tier+(t?' &middot; <b>'+fm$(pk.pr)+'</b> to '+esc(state.teams[pk.t].name):'')+'</div></div>'+
      '<div class="pr"><div class="e mono">'+fm$(adjExp(p))+'</div><div class="c mono">max '+fm$(adjCeil(p))+'</div></div>'+
      (t?'':'<button class="bidbtn" data-b="'+r.i+'">BID</button>')+'</div>';
  }).join('')||'<div class="small" style="padding:20px">No players match.</div>';
  document.querySelectorAll('.prow').forEach(r=>r.onclick=()=>pickSheet(+r.dataset.i));
  document.querySelectorAll('.bidbtn').forEach(b=>b.onclick=e=>{e.stopPropagation();nomSheet(+b.dataset.b);});
}

/* ---------- pick sheet ---------- */
let selTeam=null,selPrice=null;
function pickSheet(i){
  const p=byIdx(i),taken=takenMap();
  selTeam=state.myTeam;selPrice=adjExp(p);
  const sh=document.getElementById('sheet');
  const existing=taken[i]!==undefined?state.picks[taken[i]]:null;
  sh.innerHTML='<h3>'+esc(p.name)+'</h3>'+
    '<div class="sub">#'+p.rank+' &middot; '+p.pos+' &middot; '+esc(p.team)+' &middot; Tier '+p.tier+' &middot; market '+fm$(adjExp(p))+' &middot; your ceiling '+fm$(p.ceil)+' (fixed)</div>'+
    (p.note?'<div class="note">'+esc(p.note)+'</div>':'')+
    (p.flags.includes('bust')?'<div class="note">Panel flags overpriced - stick to the ceiling.</div>':'')+
    '<div class="small">Team that won him:</div>'+
    '<div class="tgrid">'+state.teams.map((t,ti)=>'<button data-t="'+ti+'" class="'+(ti===selTeam?'sel':'')+(ti===state.myTeam?' minebtn':'')+'">'+(ti===state.myTeam?'&#9733; ':'')+esc(t.name)+'</button>').join('')+'</div>'+
    '<div class="small">Price:</div>'+
    '<div class="pricerow"><button class="step" id="pm">-</button><input id="priceIn" type="number" inputmode="numeric" min="1" value="'+selPrice+'"><button class="step" id="pp">+</button></div>'+
    '<div class="qchips"><button data-q="1">$1</button><button data-q="'+adjExp(p)+'">exp '+fm$(adjExp(p))+'</button><button data-q="'+adjCeil(p)+'">ceil '+fm$(adjCeil(p))+'</button><button data-q="5">+5</button></div>'+
    '<button class="bigbtn" id="logPick">'+(existing?'Update pick':'Log pick')+'</button>'+
    (existing?'<button class="bigbtn sec" id="delPick">Remove pick</button>':'')+
    '<button class="bigbtn sec" id="closeSheet">Cancel</button>';
  openSheet(document.querySelector('.prow[data-i="'+i+'"]'));
  sh.querySelectorAll('.tgrid button').forEach(b=>b.onclick=()=>{selTeam=+b.dataset.t;sh.querySelectorAll('.tgrid button').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');});
  const pin=sh.querySelector('#priceIn');
  sh.querySelector('#pm').onclick=()=>{pin.value=Math.max(1,(+pin.value||1)-1);};
  sh.querySelector('#pp').onclick=()=>{pin.value=(+pin.value||0)+1;};
  sh.querySelectorAll('.qchips button').forEach(b=>b.onclick=()=>{const q=b.dataset.q;pin.value=q==='5'?(+pin.value||0)+5:+q;});
  const logBtn=sh.querySelector('#logPick');
  const warn=()=>{const over=(+pin.value||0)>p.ceil&&selTeam===state.myTeam;logBtn.style.background=over?'var(--bad)':'var(--good)';logBtn.textContent=over?'Over your ceiling - log anyway':(existing?'Update pick':'Log pick');};
  pin.addEventListener('input',warn);
  sh.querySelectorAll('.tgrid button').forEach(b=>b.addEventListener('click',()=>setTimeout(warn,0)));
  setTimeout(warn,0);
  sh.querySelector('#logPick').onclick=()=>{
    const pr=Math.max(1,Math.round(+pin.value||1));
    if(existing){existing.t=selTeam;existing.pr=pr;}
    else state.picks.push({p:i,t:selTeam,pr,ts:Date.now()});
    save();closeSheet();render();
  };
  const del=sh.querySelector('#delPick');
  if(del)del.onclick=()=>{state.picks.splice(takenMap()[i],1);save();closeSheet();render();};
  sh.querySelector('#closeSheet').onclick=closeSheet;
}

/* ---------- nominee decision sheet (ChatGPT P0) ---------- */
function posOverlap(a,b){const A=a.split('/'),B=b.split('/');return A.some(x=>B.includes(x));}
function nomSheet(i){
  const p=byIdx(i),taken=takenMap();
  if(taken[i]!==undefined){pickSheet(i);return;}
  const st=teamStats(),me=st[state.myTeam];
  const left=me.left,openNow=openSlots(state.myTeam),openAfter=Math.max(0,openNow-1);
  const legalMax=left-openAfter;
  const bidUpTo=Math.max(0,Math.min(p.ceil,legalMax));
  const leftAfter=left-bidUpTo;
  const perSlot=openAfter>0?Math.round(leftAfter/openAfter):0;
  const mkt=adjExp(p);
  let rivals=0;state.teams.forEach((t,ti)=>{if(ti!==state.myTeam&&openSlots(ti)>0&&maxBid(ti)>=mkt)rivals++;});
  const a=allPlayers();
  const alts=a.map((q,qi)=>({q,qi})).filter(x=>x.qi!==i&&taken[x.qi]===undefined&&posOverlap(p.pos,x.q.pos))
    .map(x=>({x,hr:adjCeil(x.q)-adjExp(x.q)})).sort((u,v)=>v.hr-u.hr).slice(0,3);
  const stat=(k,v)=>'<div class="cell"><div class="v mono">'+v+'</div><div class="k">'+k+'</div></div>';
  const sh=document.getElementById('sheet');
  sh.innerHTML='<h3>'+esc(p.name)+'</h3>'+
    '<div class="sub">#'+p.rank+' &middot; '+p.pos+' &middot; '+esc(p.team)+' &middot; Tier '+p.tier+'</div>'+
    '<div class="nomgrid">'+stat('Market',fm$(mkt))+stat('Ceiling',fm$(p.ceil))+stat('Legal max',legalMax>0?fm$(legalMax):'&mdash;')+'</div>'+
    '<div class="bidupto">'+(bidUpTo>0?'BID UP TO '+fm$(bidUpTo):'CANNOT BID')+'</div>'+
    (bidUpTo>0?'<div class="sub">Win at '+fm$(bidUpTo)+' &rarr; '+fm$(leftAfter)+' left for '+openAfter+' slot'+(openAfter===1?'':'s')+' (~'+fm$(perSlot)+'/slot). Ceiling is fixed; legal max = budget minus $1 per other open slot.</div>'
      :'<div class="note">No dollars above your $1-per-slot reserve. Cut elsewhere or pass.</div>')+
    '<div class="sub">'+rivals+' rival'+(rivals===1?'':'s')+' can pay market right now.</div>'+
    (alts.length?'<div class="small">If the price runs - alternatives:</div>'+alts.map(u=>'<div class="altrow" data-a="'+u.x.qi+'"><div><b>'+esc(u.x.q.name)+'</b> <span class="small">'+u.x.q.pos+' &middot; T'+u.x.q.tier+'</span></div><div class="mono">'+fm$(adjExp(u.x.q))+' <span class="small">max '+fm$(adjCeil(u.x.q))+'</span></div></div>').join(''):'')+
    '<button class="bigbtn" id="toLog">Log the sale</button>'+
    '<button class="bigbtn sec" id="closeSheet">Close</button>';
  openSheet(document.querySelector('.prow[data-i="'+i+'"]'));
  sh.querySelector('#toLog').onclick=()=>pickSheet(i);
  sh.querySelector('#closeSheet').onclick=closeSheet;
  sh.querySelectorAll('.altrow').forEach(r=>r.onclick=()=>nomSheet(+r.dataset.a));
}
function customSheet(){
  const sh=document.getElementById('sheet');
  sh.innerHTML='<h3>Add unlisted player</h3><div class="sub">For anyone outside the top 182.</div>'+
    '<input id="cName" placeholder="Player name" style="width:100%;padding:12px;font-size:16px;background:var(--bg3);border:1px solid var(--line);border-radius:10px;color:var(--tx);margin-bottom:8px">'+
    '<select id="cPos" class="dark"><option>G</option><option>F</option><option>C</option><option>G/F</option><option>F/C</option></select>'+
    '<div style="height:8px"></div>'+
    '<button class="bigbtn" id="cAdd">Add &amp; log pick</button><button class="bigbtn sec" id="cCancel">Cancel</button>';
  openSheet(document.getElementById('addCustom'));
  sh.querySelector('#cCancel').onclick=closeSheet;
  sh.querySelector('#cAdd').onclick=()=>{
    const nm=sh.querySelector('#cName').value.trim()||('Unlisted '+(state.custom.length+1));
    state.custom.push({rank:900+state.custom.length,name:nm,pos:sh.querySelector('#cPos').value,team:'-',tier:10,exp:1,ceil:2,flags:[],note:''});
    save();closeSheet();pickSheet(allPlayers().length-1);
  };
}
// The hosted page is as tall as the complete player board. A bottom-fixed
// sheet opens below the visible screen, so anchor it to the selected row.
function openSheet(anchor){
  const sh=document.getElementById('sheet');
  const visibleAnchor=anchor&&anchor.getClientRects().length?anchor:document.querySelector('.view.on');
  sh.style.top=Math.max(0,(visibleAnchor?visibleAnchor.getBoundingClientRect().top:0)+window.scrollY)+'px';
  document.getElementById('scrim').classList.add('open');
  sh.classList.add('open');
  sh.scrollIntoView({block:'start',behavior:'instant'});
}
function closeSheet(){document.getElementById('scrim').classList.remove('open');document.getElementById('sheet').classList.remove('open');}
document.getElementById('scrim').onclick=closeSheet;
/* ---------- my team ---------- */
function renderMine(el){
  const st=teamStats()[state.myTeam],slots=assignSlots(state.myTeam);
  const spent=st.spent,left=st.left;
  const TEMPL={A:[70,36,22,18,14,11,9,7,5,3,2,2,1],B:[68,34,22,20,14,11,9,7,5,4,3,2,1],C:[75,28,24,20,12,10,9,7,5,4,3,2,1],D:[32,32,30,30,28,14,10,8,5,4,3,2,2]};
  const myPrices=st.players.map(pk=>pk.pr).sort((a,b)=>b-a);
  el.innerHTML=
   '<div class="card"><h4>Budget</h4>'+
   '<div class="kv"><span>Spent</span><b class="mono">'+fm$(spent)+' / $200</b></div>'+
   '<div class="bar"><i style="width:'+Math.min(100,spent/2)+'%"></i></div>'+
   '<div class="kv"><span>Remaining</span><b class="mono good-tx">'+fm$(left)+'</b></div>'+
   '<div class="kv"><span>Open slots</span><b class="mono">'+(13-st.count)+'</b></div>'+
   '<div class="kv"><span>Max bid (left minus $1/other slot)</span><b class="mono warn-tx">'+fm$(Math.max(0,maxBid(state.myTeam)))+'</b></div></div>'+
   '<div class="card"><h4>Punt direction</h4><div style="display:flex;gap:6px;flex-wrap:wrap">'+
   [['none','None yet'],['ft','FT%'],['to','Soft TO'],['ast','AST'],['blk','BLK']].map(p=>'<button class="puntbtn'+(state.punt===p[0]?' sel':'')+'" data-p="'+p[0]+'">'+p[1]+'</button>').join('')+'</div>'+
   '<div class="small" style="margin-top:6px">Decide after your first two significant buys. FT% = Giannis/Kessler/Gobert type. Never punt PTS/REB/3PM or both percentages.</div></div>'+
   '<div class="card"><h4>Roster ('+st.count+'/13)</h4><div class="slotgrid">'+
   slots.map(s=>'<div class="slot'+(s.pick?'':' empty')+'"><div class="sl">'+s.slot+'</div><div class="sp">'+(s.pick?esc(byIdx(s.pick.p).name)+' <span class="dim-tx mono">'+fm$(s.pick.pr)+'</span>':'&mdash;')+'</div></div>').join('')+'</div></div>'+
   '<div class="card"><h4>Template check (prices paid, sorted)</h4>'+
   '<div class="small">Paid: <span class="mono">'+ (myPrices.map(p=>fm$(p)).join(' / ')||'none yet') +'</span></div><div class="hr"></div>'+
   Object.keys(TEMPL).map(k=>'<div class="kv"><span>Template '+k+'</span><span class="mono dim-tx" style="font-size:11px">'+TEMPL[k].join('/')+'</span></div>').join('')+
   '<div class="small" style="margin-top:6px">A: anchor landed $66-76. C: anchor $75-80. D: stars inflated past $70. Never &gt;$140 on top two.</div></div>';
  el.querySelectorAll('.puntbtn').forEach(b=>b.onclick=()=>{state.punt=b.dataset.p;save();render();});
}

/* ---------- teams ---------- */
let teamOpen=-1;
function renderTeams(el){
  const sts=teamStats();
  el.innerHTML='<div class="small" style="margin-bottom:8px">Tap a team for its roster. Tap the name to rename. Star = your team.</div>'+
   sts.map((s,ti)=>{
    const isMe=ti===state.myTeam;
    let h='<div class="teamrow"><button data-star="'+ti+'" style="font-size:17px;color:'+(isMe?'var(--gold)':'var(--dim)')+'">'+(isMe?'&#9733;':'&#9734;')+'</button>'+
     '<div class="tn" data-rename="'+ti+'">'+esc(state.teams[ti].name)+'</div>'+
     '<div class="ts mono">'+fm$(s.left)+' left &middot; max '+fm$(Math.max(0,maxBid(ti)))+'<br>'+s.count+'/13 players</div>'+
     '<button data-exp="'+ti+'" class="linkbtn">'+(teamOpen===ti?'hide':'view')+'</button></div>';
    if(teamOpen===ti){
      const slots=assignSlots(ti);
      h+='<div class="slotgrid" style="padding:6px 4px 12px">'+slots.map(s=>'<div class="slot'+(s.pick?'':' empty')+'"><div class="sl">'+s.slot+'</div><div class="sp">'+(s.pick?esc(byIdx(s.pick.p).name)+' <span class="dim-tx mono">'+fm$(s.pick.pr)+'</span>':'&mdash;')+'</div></div>').join('')+'</div>';
    }
    return h;
   }).join('');
  el.querySelectorAll('[data-star]').forEach(b=>b.onclick=()=>{state.myTeam=+b.dataset.star;save();render();});
  el.querySelectorAll('[data-exp]').forEach(b=>b.onclick=()=>{const t=+b.dataset.exp;teamOpen=teamOpen===t?-1:t;render();});
  el.querySelectorAll('[data-rename]').forEach(d=>d.onclick=()=>{
    const ti=+d.dataset.rename;
    const nm=prompt('Team name:',state.teams[ti].name);
    if(nm&&nm.trim()){state.teams[ti].name=nm.trim().slice(0,18);save();render();}
  });
}

/* ---------- intel ---------- */
function renderIntel(el){
  const taken=takenMap(),inf=inflation();
  const avail=allPlayers().map((p,i)=>({p,i})).filter(r=>taken[r.i]===undefined);
  // best remaining values: sleepers + fallers by exp
  const myOpen=assignSlots(state.myTeam).filter(x=>!x.pick).map(x=>x.slot);
  const needPos=p=>myOpen.some(sl=>slotElig(p.pos).some(g=>g.includes(sl)));
  const values=avail.map(r=>({r,score:r.p.ceil-adjExp(r.p)+(r.p.flags.includes('sleeper')?2:0)}))
    .filter(x=>x.score>=0&&x.r.p.exp>=3)
    .sort((a,b)=>b.score-a.score).slice(0,10).map(x=>x.r);
  // nomination candidates: bust/inj bait and non-fit high exp, phase-dependent
  const early=state.picks.length<15;
  const stsAll=teamStats();
  const canAfford=amt=>stsAll.filter((s,i)=>i!==state.myTeam&&s.left-openSlots(i)>=amt).length;
  const noms=avail.filter(r=>{
    if(r.p.rank<=3)return false;
    if(early)return adjExp(r.p)>=30&&adjExp(r.p)<=60;
    return r.p.flags.includes('bust')||r.p.flags.includes('injury');
  }).sort((a,b)=>b.p.exp-a.p.exp).slice(0,5);
  // richest rivals
  const sts=teamStats().map((s,i)=>({s,i})).sort((a,b)=>b.s.left-a.s.left).slice(0,3);
  // recent overpays
  const overs=state.picks.slice(-8).reverse();
  const rivals=teamStats().map((s,i)=>({s,i})).filter(x=>x.i!==state.myTeam)
    .sort((a,b)=>Math.max(0,maxBid(b.i))-Math.max(0,maxBid(a.i)));
  const endgame=avail.filter(r=>r.p.exp<=5&&r.p.exp>=1).sort((a,b)=>b.p.exp-a.p.exp).slice(0,10);
  el.innerHTML=
   '<div class="card"><h4>Rival max bids (who can outbid you)</h4>'+
   rivals.map(r=>'<div class="kv"><span>'+esc(state.teams[r.i].name)+'</span><b class="mono">'+fm$(Math.max(0,maxBid(r.i)))+' <span class="dim-tx" style="font-weight:400">max &middot; '+fm$(r.s.left)+' left &middot; '+(13-r.s.count)+' open</span></b></div>').join('')+'</div>'+
   '<div class="card"><h4>Inflation tracker</h4>'+
   '<div class="kv"><span>Room $ left</span><b class="mono">'+fm$(inf.totalLeft)+'</b></div>'+
   '<div class="kv"><span>Curve $ left (remaining players)</span><b class="mono">'+fm$(Math.round(inf.remCurve))+'</b></div>'+
   '<div class="kv"><span>Market inflation (discretionary $)</span><b class="mono '+(mktFactor()>1.05?'bad-tx':mktFactor()<0.95?'good-tx':'')+'">'+mktFactor().toFixed(3)+'x</b></div>'+
   '<div class="small" style="margin-top:6px">'+(mktFactor()>1.05?'Room is overspending - market prices run hot, value comes late. Stay patient on tiers 4-6.':mktFactor()<0.95?'Room is underspending - players are going cheap. Be more aggressive on your targets.':'Room is on curve.')+' Board market prices include this factor; your ceilings stay fixed.</div></div>'+
   '<div class="card"><h4>Best remaining values (ceiling minus market price)</h4>'+
   (values.map(r=>'<div class="logrow"><div class="lp"><b>'+esc(r.p.name)+'</b> '+flagBadges(r.p,r.i)+'<div class="lt">'+r.p.pos+' &middot; T'+r.p.tier+' &middot; '+esc(r.p.note)+'</div></div><div class="mono">'+fm$(adjExp(r.p))+' <span class="dim-tx">/ '+fm$(adjCeil(r.p))+'</span></div><button class="linkbtn" data-pick="'+r.i+'">log</button></div>').join('')||'<div class="small">None flagged yet.</div>')+'</div>'+
   '<div class="card"><h4>Nomination suggestions '+(early?'(early: drain cash)':'(mid: bait)')+'</h4>'+
   '<div class="small" style="margin-bottom:6px">Richest rivals: '+sts.map(r=>esc(state.teams[r.i].name)+' '+fm$(r.s.left)).join(', ')+'</div>'+
   (noms.map(r=>'<div class="logrow"><div class="lp"><b>'+esc(r.p.name)+'</b><div class="lt">'+r.p.pos+' &middot; T'+r.p.tier+(r.p.flags.includes('bust')?' &middot; overpriced bait':r.p.flags.includes('injury')?' &middot; injury bait':' &middot; drains rival cash')+'</div></div><div class="mono dim-tx" style="text-align:right">exp '+fm$(adjExp(r.p))+'<br>'+canAfford(adjExp(r.p))+' rivals can bid</div></div>').join('')||'<div class="small">No candidates in this phase.</div>')+'</div>'+
   '<div class="card"><h4>Endgame targets ($1-5, best first)</h4>'+
   (endgame.map(r=>'<div class="logrow"><div class="lp"><b>'+esc(r.p.name)+'</b><div class="lt">'+r.p.pos+' &middot; T'+r.p.tier+'</div></div><div class="mono">'+fm$(r.p.exp)+'</div><button class="linkbtn" data-pick="'+r.i+'">log</button></div>').join('')||'<div class="small">Pool empty.</div>')+'</div>'+
   '<div class="card"><h4>Recent picks vs value</h4>'+
   (overs.map(pk=>{const p=byIdx(pk.p);const d=pk.pr-p.exp;
     const cls=d>3?'t-over':d<-3?'t-under':'t-fair';const lbl=d>3?'over '+(d>0?'+':'')+fm$(d):d<-3?'value '+fm$(d):'fair';
     return '<div class="logrow"><div class="lp">'+esc(p.name)+' <span class="dim-tx">to '+esc(state.teams[pk.t].name)+'</span></div><span class="tag '+cls+'">'+lbl+'</span><span class="mono">'+fm$(pk.pr)+'</span></div>';}).join('')||'<div class="small">No picks yet.</div>')+'</div>'+
   '<div class="card"><h4>Scarcity watch</h4>'+scarcity()+'</div>';
  el.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>pickSheet(+b.dataset.pick));
}
function scarcity(){
  const taken=takenMap();
  const cnt={C:0,'F/C':0,F:0,'G/F':0,G:0};
  allPlayers().forEach((p,i)=>{if(taken[i]===undefined&&cnt[p.pos]!==undefined&&p.exp>=3)cnt[p.pos]++;});
  const cLeft=cnt['C']+cnt['F/C'];
  return '<div class="kv"><span>C-eligible left (exp $3+)</span><b class="mono '+(cLeft<10?'bad-tx':'')+'">'+cLeft+'</b></div>'+
   '<div class="kv"><span>Pure C left</span><b class="mono">'+cnt['C']+'</b></div>'+
   '<div class="kv"><span>G left</span><b class="mono">'+cnt['G']+cnt['G/F']+'</b></div>'+
   '<div class="kv"><span>F left</span><b class="mono">'+cnt['F']+cnt['G/F']+cnt['F/C']+'</b></div>'+
   '<div class="small" style="margin-top:6px">Two C slots per team: buy your first C by ~pick 40, second by ~pick 90.</div>';
}

/* ---------- log ---------- */
function renderLog(el){
  el.innerHTML='<div class="small" style="margin-bottom:8px">Picks logged: <b>'+state.picks.length+'</b> - cross-check against Yahoo budget column every ~20 picks; if they diverge, trust Yahoo and fix entries.</div>'+
   '<div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">'+
   '<button class="chip" id="undo">Undo last</button><button class="chip" id="exp">Export</button><button class="chip" id="imp">Import</button><button class="chip" id="reset">Reset draft</button></div>'+
   '<div id="ioBox"></div>'+
   state.picks.map((pk,i)=>{const p=byIdx(pk.p);const d=pk.pr-p.exp;
     const cls=d>3?'t-over':d<-3?'t-under':'t-fair';
     return '<div class="logrow"><div class="rk mono dim-tx">'+(i+1)+'</div><div class="lp"><b>'+esc(p.name)+'</b> <span class="tag '+cls+'">'+(d>0?'+':'')+fm$(d)+'</span><div class="lt">'+esc(state.teams[pk.t].name)+'</div></div><div class="mono">'+fm$(pk.pr)+'</div><button class="linkbtn" data-edit="'+i+'">edit</button></div>';}).reverse().join('')||'<div class="small" style="padding:16px">No picks logged yet. Board &rarr; tap a player.</div>';
  el.querySelector('#undo').onclick=()=>{if(state.picks.length){state.picks.pop();save();render();}};
  el.querySelector('#reset').onclick=()=>{if(confirm('Reset the whole draft? This clears every pick.')){state.picks=[];state.custom=[];save();render();}};
  el.querySelector('#exp').onclick=()=>{document.getElementById('ioBox').innerHTML='<div class="card"><h4>Export state (copy this)</h4><textarea class="io" readonly>'+esc(JSON.stringify(state))+'</textarea></div>';};
  el.querySelector('#imp').onclick=()=>{document.getElementById('ioBox').innerHTML='<div class="card"><h4>Import state (paste, then Apply)</h4><textarea class="io" id="impTx"></textarea><button class="bigbtn" id="impGo">Apply import</button></div>';
    el.querySelector('#impGo').onclick=()=>{try{const s=JSON.parse(el.querySelector('#impTx').value);if(s.teams&&s.picks){state=s;save();render();}else alert('Not a valid state.');}catch(e){alert('Parse error: '+e.message);}};};
  el.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const pk=state.picks[+b.dataset.edit];pickSheet(pk.p);});
}

document.body.addEventListener('pointerdown',function(){try{navigator.wakeLock&&navigator.wakeLock.request('screen').catch(()=>{});}catch(e){}});
render();

}
