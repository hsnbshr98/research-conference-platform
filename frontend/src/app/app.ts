import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  username = '';
  password = '';

  registerUsername = '';
  registerEmail = '';
  registerFirstName = '';
  registerLastName = '';
  registerPassword = '';
  registerConfirmPassword = '';

  authMode: 'login' | 'register' = 'login';
  activePage: 'dashboard' | 'departments' | 'researchers' | 'conferences' | 'papers' = 'dashboard';

  loginMessage = 'Please log in using your account.';
  registerMessage = 'Create a new account.';

  token = localStorage.getItem('token') || '';

  departments: any[] = [];
  departmentsMessage = 'Click the button to load departments.';
  researchers: any[] = [];
  researchersMessage = 'Click the button to load researchers.';
  researcherFirstName = '';
  researcherLastName = '';
  researcherEmail = '';
  researcherAcademicRank = '';
  researcherDepartment = '';
  researcherBiography = '';
  createResearcherMessage = 'Fill the form to create your researcher profile.';
  showResearcherForm = false;
  conferences: any[] = [];
  conferencesMessage = 'Click the button to load conferences.';
  papers: any[] = [];
  papersMessage = 'Click the button to load papers.';
  paperTitle = '';
  paperAbstract = '';
  paperKeywords = '';
  paperCorrespondingEmail = '';
  paperConference = '';
  paperPublicationDate = '';
  paperStatus = 'draft';
  createPaperMessage = 'Fill the form to create a paper.';
  showPaperForm = false;

  constructor(private apiService: ApiService) {}

  isLoggedIn(): boolean {
    return this.token !== '';
  }

  showLogin() {
    this.authMode = 'login';
  }

  showRegister() {
    this.authMode = 'register';
  }

  goToPage(page: 'dashboard' | 'departments' | 'researchers' | 'conferences' | 'papers') {
    this.activePage = page;
  }

  login() {
    this.apiService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.token = response.token;
        localStorage.setItem('token', this.token);

        this.loginMessage = `Login successful. Welcome ${response.user.username}.`;

        this.username = '';
        this.password = '';
        this.activePage = 'dashboard';
      },
      error: (error) => {
        this.loginMessage =
          'Login failed:\n' + JSON.stringify(error.error, null, 2);
      }
    });
  }

  register() {
    const userData = {
      username: this.registerUsername,
      email: this.registerEmail,
      first_name: this.registerFirstName,
      last_name: this.registerLastName,
      password: this.registerPassword,
      confirm_password: this.registerConfirmPassword
    };

    this.apiService.register(userData).subscribe({
      next: (response) => {
        this.token = response.token;
        localStorage.setItem('token', this.token);

        this.registerMessage = `Registration successful. Welcome ${response.user.username}.`;

        this.registerUsername = '';
        this.registerEmail = '';
        this.registerFirstName = '';
        this.registerLastName = '';
        this.registerPassword = '';
        this.registerConfirmPassword = '';

        this.activePage = 'dashboard';
      },
      error: (error) => {
        this.registerMessage =
          'Registration failed:\n' + JSON.stringify(error.error, null, 2);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.token = '';
    this.departments = [];
    this.departmentsMessage = 'Click the button to load departments.';
    this.researchers = [];
    this.researchersMessage = 'Click the button to load researchers.';
    this.conferences = [];
    this.conferencesMessage = 'Click the button to load conferences.';
    this.papers = [];
    this.papersMessage = 'Click the button to load papers.';
    this.loginMessage = 'You have logged out.';
    this.authMode = 'login';
    this.activePage = 'dashboard';
  }

  loadDepartments() {
    this.apiService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response;

        if (this.departments.length === 0) {
          this.departmentsMessage = 'No departments found yet.';
        } else {
          this.departmentsMessage = `${this.departments.length} department(s) loaded.`;
        }
      },
      error: (error) => {
        this.departmentsMessage =
          'Error loading departments:\n' + JSON.stringify(error.error, null, 2);
      }
    });
  }
  loadResearchers() {
  this.apiService.getResearchers().subscribe({
    next: (response) => {
      this.researchers = response;

      if (this.researchers.length === 0) {
        this.researchersMessage = 'No researchers found yet.';
      } else {
        this.researchersMessage = `${this.researchers.length} researcher(s) loaded.`;
      }
    },
    error: (error) => {
      this.researchersMessage =
        'Error loading researchers:\n' + JSON.stringify(error.error, null, 2);
    }
  });
}
createResearcherProfile() {
  const researcherData = {
    first_name: this.researcherFirstName,
    last_name: this.researcherLastName,
    email: this.researcherEmail,
    academic_rank: this.researcherAcademicRank,
    department: this.researcherDepartment,
    biography: this.researcherBiography
  };

  this.apiService.createResearcher(researcherData).subscribe({
    next: () => {
      this.createResearcherMessage = 'Researcher profile created successfully.';

      this.researcherFirstName = '';
      this.researcherLastName = '';
      this.researcherEmail = '';
      this.researcherAcademicRank = '';
      this.researcherDepartment = '';
      this.researcherBiography = '';
      

      this.loadResearchers();
      this.showResearcherForm = false;
    },
    error: (error) => {
      this.createResearcherMessage =
        'Error creating researcher profile:\n' + JSON.stringify(error.error, null, 2);
    }
  });
}
  loadConferences() {
  this.apiService.getConferences().subscribe({
    next: (response) => {
      this.conferences = response;

      if (this.conferences.length === 0) {
        this.conferencesMessage = 'No conferences found yet.';
      } else {
        this.conferencesMessage = `${this.conferences.length} conference(s) loaded.`;
      }
    },
    error: (error) => {
      this.conferencesMessage =
        'Error loading conferences:\n' + JSON.stringify(error.error, null, 2);
    }
  });
}

loadPapers() {
  this.apiService.getPapers().subscribe({
    next: (response) => {
      this.papers = response;

      if (this.papers.length === 0) {
        this.papersMessage = 'No papers found yet.';
      } else {
        this.papersMessage = `${this.papers.length} paper(s) loaded.`;
      }
    },
    error: (error) => {
      this.papersMessage =
        'Error loading papers:\n' + JSON.stringify(error.error, null, 2);
    }
  });
}
createPaper() {
  const paperData = {
    title: this.paperTitle,
    abstract: this.paperAbstract,
    keywords: this.paperKeywords,
    corresponding_email: this.paperCorrespondingEmail,
    conference: this.paperConference,
    publication_date: this.paperPublicationDate,
    status: this.paperStatus
  };

  this.apiService.createPaper(paperData).subscribe({
    next: () => {
      this.createPaperMessage = 'Paper created successfully.';

      this.paperTitle = '';
      this.paperAbstract = '';
      this.paperKeywords = '';
      this.paperCorrespondingEmail = '';
      this.paperConference = '';
      this.paperPublicationDate = '';
      this.paperStatus = 'draft';

      this.loadPapers();
    },
    error: (error) => {
      this.createPaperMessage =
        'Error creating paper:\n' + JSON.stringify(error.error, null, 2);
    }

  });

}getDepartmentName(departmentValue: any): string {
  if (!departmentValue) {
    return 'Not provided';
  }

  if (typeof departmentValue === 'object' && departmentValue.name) {
    return departmentValue.name;
  }

  const department = this.departments.find(
    (item) => String(item.id) === String(departmentValue)
  );

  return department ? department.name : `Department #${departmentValue}`;
}

getConferenceName(conferenceValue: any): string {
  if (!conferenceValue) {
    return 'Not provided';
  }

  if (typeof conferenceValue === 'object' && conferenceValue.name) {
    return conferenceValue.name;
  }

  const conference = this.conferences.find(
    (item) => String(item.id) === String(conferenceValue)
  );

  return conference ? conference.name : `Conference #${conferenceValue}`;
}
toggleResearcherForm() {
  this.showResearcherForm = !this.showResearcherForm;
}

cancelResearcherForm() {
  this.showResearcherForm = false;

  this.researcherFirstName = '';
  this.researcherLastName = '';
  this.researcherEmail = '';
  this.researcherAcademicRank = '';
  this.researcherDepartment = '';
  this.researcherBiography = '';

  this.createResearcherMessage = 'Fill the form to create your researcher profile.';
}
togglePaperForm() {
  this.showPaperForm = !this.showPaperForm;
}

cancelPaperForm() {
  this.showPaperForm = false;

  this.paperTitle = '';
  this.paperAbstract = '';
  this.paperKeywords = '';
  this.paperCorrespondingEmail = '';
  this.paperConference = '';
  this.paperPublicationDate = '';
  this.paperStatus = 'draft';

  this.createPaperMessage = 'Fill the form to create a paper.';
}
}