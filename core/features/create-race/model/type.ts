export interface BoothData {
  Name: string;         
  Place: string;     
  BoothOrganizerID: string;    
  DefaultPoints: number;       
}

export interface TeamData {
  TeamID: string;      
  Name: string;         
  leaderEmail: string;  
}


export interface OrganizerData {
  OrganizerID: string;  
  DisplayName: string;     
  email: string;        
}

export interface RacePayload {

  RaceID: string;
  RaceName: string;             
  TimeStart: string;          
  TimeEnd: string;           
  Place: string;          
  coverUrl: string;           

  booths: BoothData[];

  teams: TeamData[];

  organizers: OrganizerData[];

  IsToggledLeaderboard: boolean; 
  IsHiddenPoint: boolean; 
}