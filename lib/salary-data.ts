// Real 2026-27 NBA roster/salary data.
//
// Source: HoopsHype team salary pages (hoopshype.com/salaries/<team>), pulled 2026-11-19.
// League thresholds: NBA official release, 2026-27 (effective July 1, 2026).
//
// What is real vs. approximate:
// - Player 2026-27 salaries: real cap figures, as published.
// - Contract years: real remaining seasons (player/team options count as a season).
// - Team totals: `officialCapHit` is the published team cap hit; it can be slightly
//   higher than the sum of the listed contracts because it includes dead money,
//   cap holds and incomplete-roster charges.
// - Only the top contracts per team are listed (10-12 players), so a team's
//   editable roster total will usually run below its official cap hit.
// - `teamSalary` used by the simulator is the sum of listed contracts, i.e. the
//   tradable payroll. Everything is editable in the UI.

export type Player = {
  id: string;
  name: string;
  pos: string;
  salary: number; // $M this season (2026-27)
  years: number; // remaining seasons incl. current
  totalValue: number; // $M remaining guaranteed (salary x years, approximate)
  noTradeClause: boolean;
  rookieScale: boolean;
};

export type Team = {
  id: string;
  city: string;
  name: string;
  abbr: string;
  conference: "East" | "West";
  division: string;
  players: Player[];
  cashAvailable: number; // $M
  firstPicks: number; // tradable future firsts
  secondPicks: number;
  officialCapHit: number; // $M published cap hit for 2026-27
};

export type LeagueRules = {
  season: string;
  salaryCap: number;
  luxuryTax: number;
  firstApron: number;
  secondApron: number;
  minimumTeamSalary: number;
  maxRoster: number;
  cashTradeLimit: number;
  minRoster: number;
};

export const DATA_META = {
  season: "2026-27",
  source: "HoopsHype",
  sourceUrl: "https://hoopshype.com/salaries/teams/",
  leagueSource: "NBA official (2026-27 salary cap release)",
  leagueSourceUrl: "https://www.nba.com/news",
  retrieved: "2026-11-19",
  note: "Player salaries are real 2026-27 cap figures. Only the top contracts per team are listed, so roster totals run below the official team cap hit (shown alongside). All values are editable.",
} as const;

export const LEAGUE: LeagueRules = {
  season: "2026-27",
  // Official 2026-27 figures, announced July 1, 2026.
  salaryCap: 164.961,
  luxuryTax: 200.428,
  firstApron: 209.015,
  secondApron: 221.686,
  minimumTeamSalary: 148.465,
  maxRoster: 15,
  // Only the top contracts are listed per team, so the roster-size warning is
  // calibrated to the sample depth rather than a full 15-man roster.
  minRoster: 8,
  cashTradeLimit: 4.0,
};

type RawPlayer = [name: string, pos: string, salary: number, years: number, flags?: string];

function toPlayers(teamId: string, raw: RawPlayer[]): Player[] {
  return raw.map(([name, pos, salary, years, flags = ""], i) => ({
    id: `${teamId}-${i}`,
    name,
    pos,
    salary,
    years,
    totalValue: Math.round(salary * years * 10) / 10,
    noTradeClause: flags.includes("N"),
    rookieScale: flags.includes("R"),
  }));
}

type RawTeam = {
  id: string; city: string; name: string; abbr: string; conference: "East" | "West";
  division: string; cash: number; firsts: number; seconds: number; capHit: number; roster: RawPlayer[];
};

const RAW: RawTeam[] = [
  // ---------- Atlantic ----------
  { id: "bos", city: "Boston", name: "Celtics", abbr: "BOS", conference: "East", division: "Atlantic", cash: 3.5, firsts: 2, seconds: 4, capHit: 203.0, roster: [
    ["Jayson Tatum", "SF", 58.46, 4], ["Paul George", "SG", 54.13, 2], ["Derrick White", "PG", 30.35, 4],
    ["Mitchell Robinson", "C", 15.04, 3], ["Sam Hauser", "SF", 10.85, 3], ["Payton Pritchard", "PG", 7.77, 4],
    ["Mike Conley", "PG", 3.88, 1], ["Ron Harper Jr.", "SG", 3.31, 3], ["Chris Cenac Jr.", "C", 2.99, 4],
    ["Hugo Gonzalez", "SG", 2.92, 4], ["Luka Garza", "C", 2.80, 1], ["Baylor Scheierman", "SG", 2.74, 3],
  ]},
  { id: "bkn", city: "Brooklyn", name: "Nets", abbr: "BKN", conference: "East", division: "Atlantic", cash: 4.0, firsts: 4, seconds: 5, capHit: 160.1, roster: [
    ["Michael Porter Jr.", "SF", 40.81, 1], ["Julius Randle", "PF", 33.33, 2], ["Terance Mann", "SG", 15.50, 2],
    ["Day'Ron Sharpe", "C", 10.00, 2], ["Moritz Wagner", "PF", 9.00, 2], ["Keon Ellis", "SG", 9.00, 2],
    ["Mikel Brown Jr.", "PG", 8.79, 4], ["Egor Demin", "PG", 7.23, 4], ["Noah Clowney", "PF", 5.41, 2],
    ["Josh Minott", "SF", 4.50, 2], ["Nolan Traore", "SG", 4.00, 4], ["Drake Powell", "SF", 3.54, 4],
  ]},
  { id: "nyk", city: "New York", name: "Knicks", abbr: "NYK", conference: "East", division: "Atlantic", cash: 3.0, firsts: 1, seconds: 3, capHit: 221.3, roster: [
    ["Karl-Anthony Towns", "C", 57.08, 2], ["OG Anunoby", "SF", 42.50, 3], ["Jalen Brunson", "PG", 37.74, 3],
    ["Mikal Bridges", "SF", 33.48, 4], ["Josh Hart", "SG", 20.92, 2], ["Landry Shamet", "SG", 5.49, 4],
    ["Jose Alvarado", "PG", 4.44, 3], ["Miles McBride", "PG", 3.96, 1], ["Jordan Clarkson", "SG", 3.88, 1],
    ["Andre Drummond", "C", 3.88, 1], ["James Wiseman", "C", 3.07, 1], ["Pacome Dadiet", "SF", 2.98, 1],
  ]},
  { id: "phi", city: "Philadelphia", name: "76ers", abbr: "PHI", conference: "East", division: "Atlantic", cash: 3.5, firsts: 3, seconds: 3, capHit: 208.4, roster: [
    ["Jaylen Brown", "SG", 57.74, 3], ["Joel Embiid", "C", 57.74, 3], ["Tyrese Maxey", "PG", 40.77, 3],
    ["VJ Edgecombe", "SG", 11.66, 2], ["Dean Wade", "SF", 9.00, 4], ["Anfernee Simons", "SG", 6.00, 1],
    ["Kentavious Caldwell-Pope", "SG", 3.88, 1], ["LeBron James", "SF", 3.88, 1], ["Labaron Philon", "PG", 3.60, 3],
    ["Dominick Barlow", "C", 3.42, 1], ["Ariel Hukporti", "C", 3.40, 1], ["Jabari Walker", "PF", 2.58, 1],
  ]},
  { id: "tor", city: "Toronto", name: "Raptors", abbr: "TOR", conference: "East", division: "Atlantic", cash: 3.0, firsts: 2, seconds: 4, capHit: 202.6, roster: [
    ["Kawhi Leonard", "SF", 50.30, 3], ["Scottie Barnes", "PF", 41.75, 4], ["Immanuel Quickley", "PG", 32.50, 3],
    ["RJ Barrett", "SG", 29.62, 1], ["Jakob Poeltl", "C", 19.50, 4], ["Collin Murray-Boyles", "PF", 6.65, 4],
    ["Allen Graves", "C", 4.07, 4], ["Kyle Anderson", "SF", 3.88, 1], ["Ja'Kobe Walter", "SG", 3.81, 3],
    ["Trayce Jackson-Davis", "C", 2.41, 1], ["Jamison Battle", "SF", 2.30, 1], ["Jamal Shead", "PG", 2.30, 4],
  ]},

  // ---------- Central ----------
  { id: "chi", city: "Chicago", name: "Bulls", abbr: "CHI", conference: "East", division: "Central", cash: 4.0, firsts: 2, seconds: 4, capHit: 165.8, roster: [
    ["Josh Giddey", "PG", 25.00, 3], ["Nicolas Claxton", "C", 23.32, 2], ["Norman Powell", "SG", 21.50, 2],
    ["Patrick Williams", "PF", 18.00, 3], ["Isaac Okoro", "SF", 11.81, 1], ["Caleb Wilson", "PF", 10.68, 4],
    ["Buddy Hield", "SG", 9.66, 2], ["Jalen Smith", "C", 9.43, 1], ["Zach Collins", "C", 8.50, 2],
    ["Tre Jones", "PG", 8.00, 2], ["Matas Buzelis", "PF", 5.72, 3], ["Noa Essengue", "PF", 5.70, 4],
  ]},
  { id: "cle", city: "Cleveland", name: "Cavaliers", abbr: "CLE", conference: "East", division: "Central", cash: 2.5, firsts: 1, seconds: 3, capHit: 206.6, roster: [
    ["Donovan Mitchell", "SG", 50.11, 4], ["Evan Mobley", "C", 50.11, 4], ["James Harden", "PG", 30.65, 3],
    ["Jarrett Allen", "C", 28.00, 3], ["Peyton Watson", "SF", 20.47, 4], ["Sam Merrill", "SG", 9.16, 3],
    ["Jaylon Tyson", "SF", 3.66, 3], ["Thomas Bryant", "C", 3.52, 1], ["Mario Hezonja", "SF", 2.85, 1],
    ["Nae'Qwan Tomlin", "SF", 2.41, 1], ["Craig Porter Jr.", "PG", 2.41, 1], ["Tyrese Proctor", "PG", 2.15, 3],
  ]},
  { id: "det", city: "Detroit", name: "Pistons", abbr: "DET", conference: "East", division: "Central", cash: 3.5, firsts: 2, seconds: 4, capHit: 194.6, roster: [
    ["Cade Cunningham", "PG", 50.11, 4], ["Jalen Duren", "C", 40.16, 4], ["John Collins", "PF", 17.00, 3],
    ["Duncan Robinson", "SG", 15.99, 2], ["Isaiah Joe", "SG", 11.32, 2], ["Ausar Thompson", "SF", 11.12, 4],
    ["Kevin Huerter", "SG", 9.51, 3], ["Ronald Holland II", "SF", 9.07, 3], ["Paul Reed", "C", 5.60, 1],
    ["Ebuka Okorie", "SG", 4.48, 4], ["Daniss Jenkins", "PG", 4.00, 1], ["Javonte Green", "SG", 3.94, 1],
  ]},
  { id: "ind", city: "Indiana", name: "Pacers", abbr: "IND", conference: "East", division: "Central", cash: 3.5, firsts: 2, seconds: 4, capHit: 207.0, roster: [
    ["Pascal Siakam", "PF", 48.92, 2], ["Tyrese Haliburton", "PG", 48.92, 3], ["Ivica Zubac", "C", 19.55, 2],
    ["Andrew Nembhard", "PG", 19.55, 2], ["Obi Toppin", "PF", 15.00, 2], ["Aaron Nesmith", "SF", 11.00, 3],
    ["T.J. McConnell", "PG", 11.00, 3], ["Jarace Walker", "PF", 8.48, 2], ["Kelly Oubre Jr.", "SF", 8.05, 2],
    ["Ben Sheppard", "SG", 5.03, 2], ["Larry Nance Jr.", "C", 3.88, 1], ["Jay Huff", "C", 2.67, 2],
  ]},
  { id: "mil", city: "Milwaukee", name: "Bucks", abbr: "MIL", conference: "East", division: "Central", cash: 3.0, firsts: 2, seconds: 3, capHit: 189.0, roster: [
    ["Tyler Herro", "SG", 33.00, 1], ["Myles Turner", "C", 26.58, 3], ["Damian Lillard", "PG", 22.52, 4],
    ["Kyle Kuzma", "PF", 20.49, 1], ["Gary Trent Jr.", "SG", 15.20, 4], ["Caris LeVert", "SG", 14.81, 1],
    ["AJ Green", "SG", 10.04, 4], ["Brayden Burries", "SG", 6.42, 4], ["Jaime Jaquez Jr.", "SF", 5.94, 2],
    ["Ousmane Dieng", "PF", 5.75, 3], ["Nate Ament", "SF", 5.50, 4], ["Kevin Porter Jr.", "PG", 5.39, 1],
  ]},

  // ---------- Southeast ----------
  { id: "atl", city: "Atlanta", name: "Hawks", abbr: "ATL", conference: "East", division: "Southeast", cash: 3.5, firsts: 3, seconds: 4, capHit: 198.2, roster: [
    ["Jalen Johnson", "PF", 30.00, 4], ["Dyson Daniels", "SG", 25.00, 4], ["CJ McCollum", "SG", 21.00, 1],
    ["Luguentz Dort", "SG", 17.22, 1], ["Onyeka Okongwu", "C", 16.12, 2], ["Nickeil Alexander-Walker", "SG", 14.40, 3],
    ["Dorian Finney-Smith", "SF", 14.20, 3], ["Jock Landale", "C", 14.10, 1], ["Corey Kispert", "SF", 13.98, 3],
    ["Aaron Wiggins", "SG", 9.03, 3], ["Kingston Flemings", "PG", 7.35, 4], ["Zuby Ejiofor", "C", 3.45, 4],
  ]},
  { id: "cha", city: "Charlotte", name: "Hornets", abbr: "CHA", conference: "East", division: "Southeast", cash: 4.0, firsts: 3, seconds: 4, capHit: 170.7, roster: [
    ["Coby White", "PG", 26.81, 3], ["Naz Reid", "C", 23.28, 4], ["Grayson Allen", "SG", 18.13, 2],
    ["Brandon Miller", "SG", 15.10, 4], ["Dennis Schroeder", "PG", 14.81, 2], ["Grant Williams", "PF", 14.27, 1],
    ["Royce O'Neale", "SF", 10.88, 2], ["Kon Knueppel", "SG", 10.52, 4], ["Tidjane Salaun", "PF", 8.24, 1],
    ["Rob Dillingham", "PG", 6.89, 1], ["Hannes Steinbach", "C", 5.23, 4], ["Christian Anderson", "SF", 4.26, 4],
  ]},
  { id: "mia", city: "Miami", name: "Heat", abbr: "MIA", conference: "East", division: "Southeast", cash: 3.0, firsts: 1, seconds: 3, capHit: 207.0, roster: [
    ["Giannis Antetokounmpo", "PF", 58.46, 2], ["Bam Adebayo", "C", 49.49, 3], ["Andrew Wiggins", "SF", 30.17, 3],
    ["Nikola Jovic", "PF", 16.20, 4], ["Bobby Portis", "C", 14.52, 2], ["Davion Mitchell", "SG", 12.40, 1],
    ["Tim Hardaway Jr.", "SG", 6.07, 1], ["Klay Thompson", "SG", 5.60, 2], ["Nick Richards", "C", 3.07, 1],
    ["Simone Fontecchio", "SF", 2.63, 1], ["Dru Smith", "PG", 2.58, 2], ["Pelle Larsson", "SG", 2.30, 4],
  ]},
  { id: "orl", city: "Orlando", name: "Magic", abbr: "ORL", conference: "East", division: "Southeast", cash: 3.5, firsts: 2, seconds: 4, capHit: 221.4, roster: [
    ["Franz Wagner", "SF", 41.75, 4], ["Paolo Banchero", "PF", 41.24, 4], ["Desmond Bane", "SG", 39.45, 3],
    ["Jalen Suggs", "PG", 32.40, 4], ["Wendell Carter Jr.", "C", 18.10, 3], ["Jonathan Isaac", "PF", 11.52, 1],
    ["Anthony Black", "PG", 10.11, 1], ["Goga Bitadze", "C", 7.61, 1], ["Tristan da Silva", "SF", 3.99, 2],
    ["Nikola Vucevic", "C", 3.88, 1], ["Jevon Carter", "PG", 3.51, 1], ["Jase Richardson", "PG", 3.13, 4],
  ]},
  { id: "was", city: "Washington", name: "Wizards", abbr: "WAS", conference: "East", division: "Southeast", cash: 4.0, firsts: 3, seconds: 4, capHit: 189.3, roster: [
    ["Anthony Davis", "PF", 58.46, 2], ["Trae Young", "PG", 49.49, 4], ["AJ Dybantsa", "SF", 14.75, 4],
    ["Alexandre Sarr", "C", 12.37, 3], ["Bilal Coulibaly", "SF", 9.24, 2], ["Tre Johnson", "SG", 8.65, 4],
    ["Deandre Ayton", "C", 8.10, 1], ["Tre Mann", "PG", 8.00, 2], ["Khris Middleton", "SF", 5.59, 3],
    ["Bub Carrington", "PG", 4.90, 3], ["Will Riley", "SG", 3.69, 4], ["Kyshawn George", "SF", 3.11, 3],
  ]},

  // ---------- Northwest ----------
  { id: "den", city: "Denver", name: "Nuggets", abbr: "DEN", conference: "West", division: "Northwest", cash: 2.5, firsts: 1, seconds: 3, capHit: 222.0, roster: [
    ["Nikola Jokic", "C", 59.03, 2], ["Jamal Murray", "PG", 50.11, 3], ["Aaron Gordon", "PF", 31.98, 3],
    ["Cameron Johnson", "SF", 23.06, 1], ["Christian Braun", "SG", 21.55, 4], ["Zeke Nnaji", "PF", 7.47, 2],
    ["Spencer Jones", "PF", 6.00, 2], ["Julian Strawther", "SF", 4.83, 2], ["DeMar DeRozan", "SF", 3.88, 1],
    ["Tyus Jones", "PG", 3.88, 1], ["Marvin Bagley III", "PF", 3.51, 1], ["DaRon Holmes II", "C", 3.37, 1],
  ]},
  { id: "min", city: "Minnesota", name: "Timberwolves", abbr: "MIN", conference: "West", division: "Northwest", cash: 2.5, firsts: 1, seconds: 3, capHit: 216.3, roster: [
    ["Anthony Edwards", "SG", 48.92, 3], ["LaMelo Ball", "PG", 40.77, 3], ["Rudy Gobert", "C", 36.50, 2],
    ["Jaden McDaniels", "SF", 25.75, 4], ["Ayo Dosunmu", "SG", 19.31, 4], ["Donte DiVincenzo", "SG", 12.54, 1],
    ["Jonathan Kuminga", "PF", 6.06, 2], ["Cody Williams", "SF", 6.02, 1], ["Joan Beringer", "C", 4.41, 4],
    ["Trey Lyles", "PF", 3.88, 1], ["Jaylen Clark", "SG", 3.09, 3], ["Bones Hyland", "PG", 2.85, 1],
  ]},
  { id: "okc", city: "Oklahoma City", name: "Thunder", abbr: "OKC", conference: "West", division: "Northwest", cash: 3.0, firsts: 5, seconds: 5, capHit: 217.7, roster: [
    ["Chet Holmgren", "C", 41.24, 4], ["Jalen Williams", "SF", 41.24, 4], ["Shai Gilgeous-Alexander", "PG", 40.81, 4],
    ["Isaiah Hartenstein", "C", 23.15, 3], ["Alex Caruso", "SG", 19.55, 3], ["Jaylin Williams", "PF", 7.77, 2],
    ["Cason Wallace", "SG", 7.42, 4], ["Aday Mara", "C", 5.79, 4], ["Nikola Topic", "PG", 5.43, 1],
    ["Kenrich Williams", "PF", 5.00, 1], ["Thomas Sorber", "C", 4.89, 4], ["Bennett Stirtz", "SG", 4.72, 4],
  ]},
  { id: "por", city: "Portland", name: "Trail Blazers", abbr: "POR", conference: "West", division: "Northwest", cash: 3.5, firsts: 3, seconds: 4, capHit: 192.1, roster: [
    ["Ja Morant", "PG", 42.17, 2], ["Jrue Holiday", "PG", 34.80, 2], ["Shaedon Sharpe", "SG", 20.09, 4],
    ["Toumani Camara", "SF", 18.08, 4], ["Robert Williams III", "C", 14.00, 3], ["Scoot Henderson", "PG", 13.59, 2],
    ["Damian Lillard", "PG", 13.40, 2], ["Deni Avdija", "SF", 13.13, 2], ["Donovan Clingan", "C", 7.52, 3],
    ["Hansen Yang", "C", 4.64, 4], ["Micah Potter", "C", 2.80, 1], ["Vit Krejci", "SG", 2.67, 2],
  ]},
  { id: "uta", city: "Utah", name: "Jazz", abbr: "UTA", conference: "West", division: "Northwest", cash: 4.0, firsts: 4, seconds: 5, capHit: 180.5, roster: [
    ["Jaren Jackson Jr.", "PF", 49.00, 4], ["Lauri Markkanen", "PF", 46.11, 3], ["Josh Green", "SF", 14.68, 1],
    ["Darryn Peterson", "SG", 13.20, 4], ["Jusuf Nurkic", "C", 11.46, 2], ["Ace Bailey", "SF", 9.52, 4],
    ["Keyonte George", "PG", 6.56, 4], ["Josh Okogie", "SG", 6.00, 2], ["Jaxson Hayes", "C", 6.00, 2],
    ["Brice Sensabaugh", "SF", 4.86, 2], ["Svi Mykhailiuk", "SF", 3.85, 2], ["Tony Bradley", "C", 3.51, 1],
  ]},

  // ---------- Pacific ----------
  { id: "gsw", city: "Golden State", name: "Warriors", abbr: "GSW", conference: "West", division: "Pacific", cash: 2.5, firsts: 1, seconds: 2, capHit: 224.3, roster: [
    ["Stephen Curry", "PG", 62.59, 3], ["Jimmy Butler III", "SF", 56.83, 1], ["Draymond Green", "PF", 27.68, 1],
    ["Kristaps Porzingis", "C", 20.00, 2], ["Moses Moody", "SG", 12.50, 2], ["Al Horford", "C", 6.82, 2],
    ["Yaxel Lendeborg", "PF", 6.10, 4], ["De'Anthony Melton", "SG", 6.06, 2], ["Brandin Podziemski", "SG", 5.68, 4],
    ["Gui Santos", "SF", 4.63, 3], ["Georges Niang", "PF", 3.88, 1], ["Gary Payton II", "SG", 3.88, 1],
  ]},
  { id: "lac", city: "LA", name: "Clippers", abbr: "LAC", conference: "West", division: "Pacific", cash: 3.5, firsts: 2, seconds: 3, capHit: 181.1, roster: [
    ["Darius Garland", "PG", 42.17, 2], ["Brandon Ingram", "SF", 40.00, 2], ["Max Strus", "SF", 16.66, 1],
    ["Rui Hachimura", "PF", 14.00, 2], ["Derrick Jones Jr.", "SF", 10.48, 1], ["Keaton Wagler", "SG", 9.67, 4],
    ["Brook Lopez", "C", 9.19, 1], ["Gradey Dick", "SG", 7.13, 2], ["Isaiah Jackson", "PF", 7.00, 2],
    ["Bradley Beal", "SG", 6.42, 2], ["Kris Dunn", "PG", 5.68, 1], ["Jordan Miller", "SF", 5.30, 3],
  ]},
  { id: "lal", city: "Los Angeles", name: "Lakers", abbr: "LAL", conference: "West", division: "Pacific", cash: 3.0, firsts: 2, seconds: 3, capHit: 205.2, roster: [
    ["Luka Doncic", "PG", 51.03, 3], ["Austin Reaves", "SG", 41.24, 4], ["Walker Kessler", "C", 30.11, 4],
    ["Quentin Grimes", "SG", 13.95, 4], ["Sandro Mamukelashvili", "PF", 13.00, 4], ["Jarred Vanderbilt", "PF", 12.43, 2],
    ["Collin Sexton", "PG", 9.37, 2], ["Jaden Hardy", "SG", 6.00, 2], ["Jake LaRavia", "PF", 6.00, 1],
    ["Dalton Knecht", "SG", 4.20, 1], ["Kevon Looney", "C", 3.88, 1], ["Cameron Carr", "SF", 3.32, 4],
  ]},
  { id: "phx", city: "Phoenix", name: "Suns", abbr: "PHX", conference: "West", division: "Pacific", cash: 2.5, firsts: 1, seconds: 2, capHit: 213.8, roster: [
    ["Devin Booker", "SG", 57.08, 4], ["Jalen Green", "SG", 36.25, 2], ["Miles Bridges", "PF", 22.83, 1],
    ["Dillon Brooks", "SF", 20.99, 4], ["Bradley Beal", "SG", 19.38, 4], ["Mark Williams", "C", 11.73, 3],
    ["Collin Gillespie", "PG", 10.71, 4], ["Khaman Maluach", "C", 6.32, 4], ["Luke Kennard", "SG", 6.06, 2],
    ["Jordan Goodwin", "PG", 5.86, 3], ["Nassir Little", "SF", 3.11, 4], ["Koa Peat", "PF", 2.93, 4],
  ]},
  { id: "sac", city: "Sacramento", name: "Kings", abbr: "SAC", conference: "West", division: "Pacific", cash: 4.0, firsts: 3, seconds: 4, capHit: 195.2, roster: [
    ["Zach LaVine", "SG", 48.97, 1], ["Domantas Sabonis", "C", 45.47, 2], ["De'Andre Hunter", "SF", 24.91, 1],
    ["Keegan Murray", "PF", 24.14, 4], ["Malik Monk", "SG", 20.19, 2], ["Darius Acuff Jr.", "PG", 8.02, 4],
    ["Precious Achiuwa", "C", 5.48, 2], ["Ben Simmons", "PG", 3.52, 1], ["Mason Plumlee", "C", 3.39, 1],
    ["DeMar DeRozan", "SF", 3.33, 3], ["Alex Karaban", "SF", 2.95, 4], ["Daeqwon Plowden", "SF", 2.45, 2],
  ]},

  // ---------- Southwest ----------
  { id: "dal", city: "Dallas", name: "Mavericks", abbr: "DAL", conference: "West", division: "Southwest", cash: 3.5, firsts: 2, seconds: 3, capHit: 188.1, roster: [
    ["Kyrie Irving", "PG", 39.49, 2], ["PJ Washington", "PF", 19.81, 4], ["Daniel Gafford", "C", 17.26, 3],
    ["Santi Aldama", "PF", 17.01, 2], ["Cooper Flagg", "SF", 14.52, 4], ["Zaccharie Risacher", "SF", 13.83, 3],
    ["Caleb Martin", "SF", 10.00, 2], ["Naji Marshall", "SF", 9.43, 4], ["Max Christie", "SG", 8.29, 2],
    ["Klay Thompson", "SG", 7.66, 1], ["Dereck Lively II", "C", 7.24, 2], ["Morez Johnson", "PF", 6.75, 4],
  ]},
  { id: "hou", city: "Houston", name: "Rockets", abbr: "HOU", conference: "West", division: "Southwest", cash: 4.0, firsts: 5, seconds: 4, capHit: 202.2, roster: [
    ["Kevin Durant", "SF", 43.90, 2], ["Alperen Sengun", "C", 35.64, 4], ["Fred VanVleet", "PG", 25.00, 1],
    ["Jabari Smith Jr.", "PF", 23.64, 4], ["Tari Eason", "PF", 14.05, 4], ["Steven Adams", "C", 13.00, 2],
    ["Amen Thompson", "PG", 12.26, 4], ["Reed Sheppard", "SG", 11.11, 3], ["Clint Capela", "C", 7.04, 2],
    ["Marcus Smart", "PG", 6.06, 2], ["Bogdan Bogdanovic", "SG", 3.52, 1], ["Jae'Sean Tate", "PF", 3.07, 1],
  ]},
  { id: "mem", city: "Memphis", name: "Grizzlies", abbr: "MEM", conference: "West", division: "Southwest", cash: 4.0, firsts: 3, seconds: 4, capHit: 161.8, roster: [
    ["Jerami Grant", "PF", 34.21, 2], ["Kentavious Caldwell-Pope", "SG", 17.75, 1], ["Isaiah Stewart", "C", 15.00, 2],
    ["Brandon Clarke", "PF", 12.50, 1], ["Cameron Boozer", "PF", 11.85, 4], ["Ty Jerome", "PG", 9.22, 2],
    ["Quinten Post", "C", 9.00, 3], ["Taylor Hendricks", "PF", 7.81, 2], ["Zach Edey", "C", 6.33, 3],
    ["Cedric Coward", "SF", 6.00, 4], ["D'Angelo Russell", "PG", 5.97, 1], ["Kris Murray", "SF", 5.32, 2],
  ]},
  { id: "nop", city: "New Orleans", name: "Pelicans", abbr: "NOP", conference: "West", division: "Southwest", cash: 4.0, firsts: 2, seconds: 3, capHit: 200.0, roster: [
    ["Zion Williamson", "PF", 42.17, 2], ["Jordan Poole", "SG", 34.04, 1], ["Dejounte Murray", "PG", 32.79, 2],
    ["Trey Murphy III", "SF", 27.00, 3], ["Herb Jones", "SF", 14.90, 4], ["Bennedict Mathurin", "SG", 8.00, 2],
    ["Jeremiah Fears", "PG", 7.90, 4], ["Saddiq Bey", "SF", 6.56, 4], ["Derik Queen", "C", 5.42, 4],
    ["DeAndre Jordan", "C", 3.88, 2], ["Yves Missi", "C", 3.51, 3], ["AJ Johnson", "SG", 3.24, 1],
  ]},
  { id: "sas", city: "San Antonio", name: "Spurs", abbr: "SAS", conference: "West", division: "Southwest", cash: 4.0, firsts: 5, seconds: 5, capHit: 199.1, roster: [
    ["De'Aaron Fox", "PG", 49.49, 4], ["Devin Vassell", "SG", 27.50, 3], ["Keldon Johnson", "SF", 18.00, 1],
    ["Victor Wembanyama", "C", 16.87, 4], ["Julian Champagnie", "SF", 15.35, 3], ["Tobias Harris", "PF", 15.04, 2],
    ["Dylan Harper", "PG", 12.99, 4], ["Luke Kornet", "C", 10.45, 3], ["Stephon Castle", "SG", 10.02, 3],
    ["Harrison Barnes", "SF", 8.00, 1], ["Carter Bryant", "SF", 5.15, 4], ["Jayden Quaintance", "PF", 3.90, 4],
  ]},
];

export const INITIAL_TEAMS: Team[] = RAW.map((t) => ({
  id: t.id,
  city: t.city,
  name: t.name,
  abbr: t.abbr,
  conference: t.conference,
  division: t.division,
  players: toPlayers(t.id, t.roster),
  cashAvailable: t.cash,
  firstPicks: t.firsts,
  secondPicks: t.seconds,
  officialCapHit: t.capHit,
}));

/** Sum of the listed (tradable) contracts on a team, in $M. */
export function teamSalary(team: Team): number {
  return team.players.reduce((s, p) => s + p.salary, 0);
}

export type ApronStatus = "under_cap" | "over_cap" | "taxpayer" | "first_apron" | "second_apron";

export function apronStatus(salary: number, league: LeagueRules = LEAGUE): ApronStatus {
  if (salary >= league.secondApron - 0.001) return "second_apron";
  if (salary >= league.firstApron - 0.001) return "first_apron";
  if (salary >= league.luxuryTax - 0.001) return "taxpayer";
  if (salary > league.salaryCap) return "over_cap";
  return "under_cap";
}

export const STATUS_LABEL: Record<ApronStatus, string> = {
  under_cap: "Under cap",
  over_cap: "Over cap",
  taxpayer: "Taxpayer",
  first_apron: "1st apron",
  second_apron: "2nd apron",
};

export const STATUS_COLOR: Record<ApronStatus, string> = {
  under_cap: "bg-green-100 text-green-700",
  over_cap: "bg-blue-100 text-blue-700",
  taxpayer: "bg-amber-100 text-amber-700",
  first_apron: "bg-orange-100 text-orange-700",
  second_apron: "bg-red-100 text-red-700",
};
