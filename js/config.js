/* League defaults. Everything here can be changed in the app's Settings tab;
 * these values are only used for a fresh draft (or after "Reset to league defaults"). */
(function (root) {
var DEFAULTS = {
  leagueName: 'Yahoo 2026-27 Auction',
  scoring: '9-cat H2H (PTS REB AST STL BLK 3PM FG% FT% TO)',
  budget: 200,
  minBid: 1,
  // 9 starters from Yahoo (PG SG G SF PF F C Util Util) + 3 bench = 12 drafted players.
  // The league also has 2 IL spots; they are not filled in the auction, so they are not listed here.
  slots: ['PG', 'SG', 'G', 'SF', 'PF', 'F', 'C', 'UTIL', 'UTIL', 'BN', 'BN', 'BN'],
  teams: [
    'Franz A Make Her Dance',
    'Big Body Brunson’s Ball Playas',
    'Orange County Oreos',
    'matt’s team',
    'Light the Beam',
    'CC22 From The Logo',
    'Naz Reid.',
    'Proxy War',
    'Brow or Never',
    'Dean’s Definitive Team',
    'Pascal’s Wager',
    'Scoot’s Gonna Be Good… Right?',
    'Shai Guys',
    'Net Results'
  ],
  myTeam: 0
};
if (typeof module === 'object' && module.exports) module.exports = DEFAULTS;
else root.DRAFT_DEFAULTS = DEFAULTS;
})(typeof self !== 'undefined' ? self : this);
