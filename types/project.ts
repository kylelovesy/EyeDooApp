// src/types/project.ts

export interface TestFormData {
  form1Data: {
    projectName: string;
    projectType: string;
  };
  form2Data: {
    clientName: string;
    venue: string;
  };
  form3Data: {
    eventDay: string;
    eventDate: string;   
  };
  form4Data: {
    eventStyle: string;
    projectStatus: string;
  };  
}