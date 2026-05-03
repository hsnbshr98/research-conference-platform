import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';

type Page = 'dashboard' | 'admin' | 'departments' | 'researchers' | 'conferences' | 'papers';

type AuthMode = 'login' | 'register';

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

  authMode: AuthMode = 'login';
  activePage: Page = 'dashboard';

  loginMessage = 'Please log in using your account.';
  registerMessage = 'Create a new account.';

  token = localStorage.getItem('token') || '';
  currentUser: any = this.readStoredUser();

  departments: any[] = [];
  departmentsMessage = 'Click the button to load departments.';
  departmentSearch = '';
  departmentName = '';
  departmentCode = '';
  departmentDescription = '';
  editingDepartmentId: number | null = null;
  departmentFormMessage = 'Admins can create, update, and delete departments.';
  showDepartmentForm = false;

  researchers: any[] = [];
  researchersMessage = 'Click the button to load researchers.';
  researcherFirstName = '';
  researcherLastName = '';
  researcherEmail = '';
  researcherAcademicRank = '';
  researcherDepartment = '';
  researcherBiography = '';
  researcherProfilePicture: File | null = null;
  researcherCvDocument: File | null = null;
  editingResearcherId: number | null = null;
  researcherFormMessage = 'Fill the form to create your researcher profile.';
  showResearcherForm = false;
  researcherSearch = '';
  researcherRankFilter = '';
  researcherDepartmentFilter = '';

  conferences: any[] = [];
  conferencesMessage = 'Click the button to load conferences.';
  conferenceName = '';
  conferenceLocation = '';
  conferenceStartDate = '';
  conferenceEndDate = '';
  conferenceSearch = '';
  conferenceDescription = '';
  editingConferenceId: number | null = null;
  conferenceFormMessage = 'Admins can create, update, and delete conferences.';
  showConferenceForm = false;

  papers: any[] = [];
  papersMessage = 'Click the button to load papers.';
  paperTitle = '';
  paperAbstract = '';
  paperKeywords = '';
  paperCorrespondingEmail = '';
  paperConference = '';
  paperPublicationDate = '';
  paperStatus = 'draft';
  editingPaperId: number | null = null;
  paperImageFile: File | null = null;
  paperPdfFile: File | null = null;
  paperFormMessage = 'Fill the form to create a paper.';
  showPaperForm = false;
  paperSearch = '';
  paperStatusFilter = '';
  paperConferenceFilter = '';

  constructor(private apiService: ApiService) {}

  isLoggedIn(): boolean {
    return this.token !== '';
  }

  isAdmin(): boolean {
    return Boolean(
      this.currentUser?.is_staff ||
      this.currentUser?.is_superuser ||
      this.currentUser?.role === 'admin' ||
      this.currentUser?.username === 'admin'
    );
  }

  showLogin() {
    this.authMode = 'login';
  }

  showRegister() {
    this.authMode = 'register';
  }

  goToPage(page: Page) {
    this.activePage = page;

    if (page === 'departments' && this.departments.length === 0) {
      this.loadDepartments();
    }

    if (page === 'researchers') {
      if (this.departments.length === 0) {
        this.loadDepartments();
      }

      if (this.researchers.length === 0) {
        this.loadResearchers();
      }
    }

    if (page === 'conferences') {
      if (this.researchers.length === 0) {
        this.loadResearchers();
      }

      if (this.conferences.length === 0) {
        this.loadConferences();
      }
    }

    if (page === 'papers') {
      if (this.conferences.length === 0) {
        this.loadConferences();
      }

      if (this.researchers.length === 0) {
        this.loadResearchers();
      }

      if (this.papers.length === 0) {
        this.loadPapers();
      }
    }
  }

  login() {
    this.apiService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.token = response.token;
        this.currentUser = response.user || { username: this.username };

        localStorage.setItem('token', this.token);
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        this.loginMessage = `Login successful. Welcome ${this.currentUser.username}.`;
        this.username = '';
        this.password = '';
        this.activePage = 'dashboard';
      },
      error: (error) => {
        this.loginMessage = 'Login failed:\n' + this.formatError(error);
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
        this.currentUser = response.user || { username: this.registerUsername };

        localStorage.setItem('token', this.token);
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        this.registerMessage = `Registration successful. Welcome ${this.currentUser.username}.`;

        this.registerUsername = '';
        this.registerEmail = '';
        this.registerFirstName = '';
        this.registerLastName = '';
        this.registerPassword = '';
        this.registerConfirmPassword = '';

        this.activePage = 'dashboard';
      },
      error: (error) => {
        this.registerMessage = 'Registration failed:\n' + this.formatError(error);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');

    this.token = '';
    this.currentUser = null;

    this.departments = [];
    this.researchers = [];
    this.conferences = [];
    this.papers = [];

    this.departmentsMessage = 'Click the button to load departments.';
    this.researchersMessage = 'Click the button to load researchers.';
    this.conferencesMessage = 'Click the button to load conferences.';
    this.papersMessage = 'Click the button to load papers.';

    this.loginMessage = 'You have logged out.';
    this.authMode = 'login';
    this.activePage = 'dashboard';

    this.cancelDepartmentForm();
    this.cancelResearcherForm();
    this.cancelConferenceForm();
    this.cancelPaperForm();
  }

  loadDepartments() {
    this.apiService.getDepartments().subscribe({
      next: (response) => {
        this.departments = this.normalizeList(response);
        this.departmentsMessage = this.departments.length === 0
          ? 'No departments found yet.'
          : `${this.departments.length} department(s) loaded.`;
      },
      error: (error) => {
        this.departmentsMessage = 'Error loading departments:\n' + this.formatError(error);
      }
    });
  }

  saveDepartment() {
    const departmentData = {
      name: this.departmentName,
      code: this.departmentCode,
      description: this.departmentDescription
    };

    const request = this.editingDepartmentId
      ? this.apiService.updateDepartment(this.editingDepartmentId, departmentData)
      : this.apiService.createDepartment(departmentData);

    request.subscribe({
      next: () => {
        this.departmentFormMessage = this.editingDepartmentId
          ? 'Department updated successfully.'
          : 'Department created successfully.';

        this.cancelDepartmentForm(false);
        this.loadDepartments();
      },
      error: (error) => {
        this.departmentFormMessage = 'Error saving department:\n' + this.formatError(error);
      }
    });
  }

  editDepartment(department: any) {
    this.editingDepartmentId = department.id;
    this.departmentName = department.name || '';
    this.departmentCode = department.code || '';
    this.departmentDescription = department.description || '';
    this.departmentFormMessage = 'Editing department.';
    this.showDepartmentForm = true;
  }

  deleteDepartment(department: any) {
    if (!confirm(`Delete department "${department.name}"?`)) {
      return;
    }

    this.apiService.deleteDepartment(department.id).subscribe({
      next: () => {
        this.departmentsMessage = 'Department deleted successfully.';
        this.loadDepartments();
      },
      error: (error) => {
        this.departmentsMessage = 'Error deleting department:\n' + this.formatError(error);
      }
    });
  }

  toggleDepartmentForm() {
    this.showDepartmentForm = !this.showDepartmentForm;

    if (!this.showDepartmentForm) {
      this.cancelDepartmentForm();
    }
  }

  cancelDepartmentForm(resetMessage = true) {
    this.showDepartmentForm = false;
    this.editingDepartmentId = null;
    this.departmentCode = '';
    this.departmentName = '';
    this.departmentDescription = '';

    if (resetMessage) {
      this.departmentFormMessage = 'Admins can create, update, and delete departments.';
    }
  }

  loadResearchers() {
    this.apiService.getResearchers().subscribe({
      next: (response) => {
        this.researchers = this.normalizeList(response);
        this.researchersMessage = this.researchers.length === 0
          ? 'No researchers found yet.'
          : `${this.researchers.length} researcher(s) loaded.`;
      },
      error: (error) => {
        this.researchersMessage = 'Error loading researchers:\n' + this.formatError(error);
      }
    });
  }

  hasCurrentUserResearcherProfile(): boolean {
    if (!this.currentUser) {
      return false;
    }

    return this.researchers.some((researcher) => {
      const researcherUser = researcher.user;

      // If backend sends user as object
      if (typeof researcherUser === 'object' && researcherUser) {
        return String(researcherUser.id || '') === String(this.currentUser.id || '')
          || String(researcherUser.username || '') === String(this.currentUser.username || '')
          || String(researcherUser.email || '') === String(this.currentUser.email || '');
      }

      // If backend sends user as user id
      return String(researcherUser || '') === String(this.currentUser.id || '')
        || String(researcher.email || '') === String(this.currentUser.email || '');
    });
  }

  onResearcherProfilePictureSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.researcherProfilePicture = input.files && input.files.length > 0
      ? input.files[0]
      : null;
  }

  onResearcherCvSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.researcherCvDocument = input.files && input.files.length > 0
      ? input.files[0]
      : null;
  }

  saveResearcherProfile() {
    const researcherData = new FormData();

    researcherData.append('first_name', this.researcherFirstName);
    researcherData.append('last_name', this.researcherLastName);
    researcherData.append('email', this.researcherEmail);
    researcherData.append('academic_rank', this.researcherAcademicRank);
    researcherData.append('biography', this.researcherBiography);

    if (this.researcherDepartment) {
      researcherData.append('department', this.researcherDepartment);
    }

    if (this.researcherProfilePicture) {
      researcherData.append('profile_picture', this.researcherProfilePicture);
    }

    if (this.researcherCvDocument) {
      researcherData.append('cv_document', this.researcherCvDocument);
    }

    const request = this.editingResearcherId
      ? this.apiService.updateResearcher(this.editingResearcherId, researcherData)
      : this.apiService.createResearcher(researcherData);

    request.subscribe({
      next: () => {
        this.researcherFormMessage = this.editingResearcherId
          ? 'Researcher profile updated successfully.'
          : 'Researcher profile created successfully.';

        this.cancelResearcherForm(false);
        this.loadResearchers();
      },
      error: (error) => {
        this.researcherFormMessage = 'Error saving researcher profile:\n' + this.formatError(error);
      }
    });
  }

  editResearcher(researcher: any) {
    this.editingResearcherId = researcher.id;
    this.researcherFirstName = researcher.first_name || '';
    this.researcherLastName = researcher.last_name || '';
    this.researcherEmail = researcher.email || '';
    this.researcherAcademicRank = researcher.academic_rank || '';
    this.researcherDepartment = this.extractId(researcher.department);
    this.researcherBiography = researcher.biography || '';
    this.researcherFormMessage = 'Editing researcher profile.';
    this.showResearcherForm = true;
  }

  deleteResearcher(researcher: any) {
    const fullName = `${researcher.first_name || ''} ${researcher.last_name || ''}`.trim() || 'this researcher';

    if (!confirm(`Delete ${fullName}?`)) {
      return;
    }

    this.apiService.deleteResearcher(researcher.id).subscribe({
      next: () => {
        this.researchersMessage = 'Researcher profile deleted successfully.';
        this.loadResearchers();
      },
      error: (error) => {
        this.researchersMessage = 'Error deleting researcher profile:\n' + this.formatError(error);
      }
    });
  }

  toggleResearcherForm() {
    this.showResearcherForm = !this.showResearcherForm;

    if (!this.showResearcherForm) {
      this.cancelResearcherForm();
    }
  }

  cancelResearcherForm(resetMessage = true) {
    this.showResearcherForm = false;
    this.editingResearcherId = null;
    this.researcherFirstName = '';
    this.researcherLastName = '';
    this.researcherEmail = '';
    this.researcherAcademicRank = '';
    this.researcherDepartment = '';
    this.researcherBiography = '';
    this.researcherProfilePicture = null;
    this.researcherCvDocument = null;

    if (resetMessage) {
      this.researcherFormMessage = 'Fill the form to create your researcher profile.';
    }
  }

  loadConferences() {
    this.apiService.getConferences().subscribe({
      next: (response) => {
        this.conferences = this.normalizeList(response);
        this.conferencesMessage = this.conferences.length === 0
          ? 'No conferences found yet.'
          : `${this.conferences.length} conference(s) loaded.`;
      },
      error: (error) => {
        this.conferencesMessage = 'Error loading conferences:\n' + this.formatError(error);
      }
    });
  }

  saveConference() {
    const conferenceData = {
      name: this.conferenceName,
      location: this.conferenceLocation,
      start_date: this.conferenceStartDate,
      end_date: this.conferenceEndDate,
      description: this.conferenceDescription
    };

    const request = this.editingConferenceId
      ? this.apiService.updateConference(this.editingConferenceId, conferenceData)
      : this.apiService.createConference(conferenceData);

    request.subscribe({
      next: () => {
        this.conferenceFormMessage = this.editingConferenceId
          ? 'Conference updated successfully.'
          : 'Conference created successfully.';

        this.cancelConferenceForm(false);
        this.loadConferences();
      },
      error: (error) => {
        this.conferenceFormMessage = 'Error saving conference:\n' + this.formatError(error);
      }
    });
  }

  editConference(conference: any) {
    this.editingConferenceId = conference.id;
    this.conferenceName = conference.name || '';
    this.conferenceLocation = conference.location || '';
    this.conferenceStartDate = conference.start_date || '';
    this.conferenceEndDate = conference.end_date || '';
    this.conferenceDescription = conference.description || '';
    this.conferenceFormMessage = 'Editing conference.';
    this.showConferenceForm = true;
  }

  deleteConference(conference: any) {
    if (!confirm(`Delete conference "${conference.name}"?`)) {
      return;
    }

    this.apiService.deleteConference(conference.id).subscribe({
      next: () => {
        this.conferencesMessage = 'Conference deleted successfully.';
        this.loadConferences();
      },
      error: (error) => {
        this.conferencesMessage = 'Error deleting conference:\n' + this.formatError(error);
      }
    });
  }

  toggleConferenceForm() {
    this.showConferenceForm = !this.showConferenceForm;

    if (!this.showConferenceForm) {
      this.cancelConferenceForm();
    }
  }

  cancelConferenceForm(resetMessage = true) {
    this.showConferenceForm = false;
    this.editingConferenceId = null;
    this.conferenceName = '';
    this.conferenceLocation = '';
    this.conferenceStartDate = '';
    this.conferenceEndDate = '';
    this.conferenceDescription = '';

    if (resetMessage) {
      this.conferenceFormMessage = 'Admins can create, update, and delete conferences.';
    }
  }

  attendConference(conference: any) {
    this.apiService.attendConference(conference.id).subscribe({
      next: (response) => {
        this.conferencesMessage = response.message || 'You are now attending this conference.';
        this.loadConferences();
      },
      error: (error) => {
        this.conferencesMessage = 'Error attending conference:\n' + this.formatError(error);
      }
    });
  }

  leaveConference(conference: any) {
    this.apiService.leaveConference(conference.id).subscribe({
      next: (response) => {
        this.conferencesMessage = response.message || 'You have left this conference.';
        this.loadConferences();
      },
      error: (error) => {
        this.conferencesMessage = 'Error leaving conference:\n' + this.formatError(error);
      }
    });
  }

  isCurrentUserAttendingConference(conference: any): boolean {
    const currentResearcher = this.getCurrentUserResearcher();

    if (!currentResearcher) {
      return false;
    }

    const attendees = conference?.attendees || [];
    const attendeeList = Array.isArray(attendees) ? attendees : [attendees];

    return attendeeList.some((attendee) => {
      const attendeeId = typeof attendee === 'object'
        ? String(attendee.id || '')
        : String(attendee);

      return attendeeId === String(currentResearcher.id);
    });
  }

  hasCurrentUserConferenceAttendance(): boolean {
    return this.conferences.some((conference) =>
      this.isCurrentUserAttendingConference(conference)
    );
  }

  loadPapers() {
    this.apiService.getPapers().subscribe({
      next: (response) => {
        this.papers = this.normalizeList(response);
        this.papersMessage = this.papers.length === 0
          ? 'No papers found yet.'
          : `${this.papers.length} paper(s) loaded.`;
      },
      error: (error) => {
        this.papersMessage = 'Error loading papers:\n' + this.formatError(error);
      }
    });
  }

  onPaperImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.paperImageFile = input.files && input.files.length > 0
      ? input.files[0]
      : null;
  }

  onPaperPdfSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.paperPdfFile = input.files && input.files.length > 0
      ? input.files[0]
      : null;
  }

  savePaper() {
    const paperData = new FormData();

    paperData.append('title', this.paperTitle);
    paperData.append('abstract', this.paperAbstract);
    paperData.append('keywords', this.paperKeywords);
    paperData.append('corresponding_email', this.paperCorrespondingEmail);
    paperData.append('status', this.paperStatus);

    if (this.paperConference) {
      paperData.append('conference', this.paperConference);
    }

    if (this.paperPublicationDate) {
      paperData.append('publication_date', this.paperPublicationDate);
    }

    if (this.paperPdfFile) {
      paperData.append('paper_pdf', this.paperPdfFile);
    }

    if (this.paperImageFile) {
      paperData.append('paper_image', this.paperImageFile);
    }

    const request = this.editingPaperId
      ? this.apiService.updatePaper(this.editingPaperId, paperData)
      : this.apiService.createPaper(paperData);

    request.subscribe({
      next: () => {
        this.paperFormMessage = this.editingPaperId
          ? 'Paper updated successfully.'
          : 'Paper created successfully.';

        this.cancelPaperForm(false);
        this.loadPapers();
      },
      error: (error) => {
        this.paperFormMessage = 'Error saving paper:\n' + this.formatError(error);
      }
    });
  }

  editPaper(paper: any) {
    this.editingPaperId = paper.id;
    this.paperTitle = paper.title || '';
    this.paperAbstract = paper.abstract || '';
    this.paperKeywords = paper.keywords || '';
    this.paperCorrespondingEmail = paper.corresponding_email || '';
    this.paperConference = this.extractId(paper.conference);
    this.paperPublicationDate = paper.publication_date || '';
    this.paperStatus = paper.status || 'draft';
    this.paperFormMessage = 'Editing paper.';
    this.showPaperForm = true;
  }

  deletePaper(paper: any) {
    if (!confirm(`Delete paper "${paper.title}"?`)) {
      return;
    }

    this.apiService.deletePaper(paper.id).subscribe({
      next: () => {
        this.papersMessage = 'Paper deleted successfully.';
        this.loadPapers();
      },
      error: (error) => {
        this.papersMessage = 'Error deleting paper:\n' + this.formatError(error);
      }
    });
  }

  togglePaperForm() {
    this.showPaperForm = !this.showPaperForm;

    if (!this.showPaperForm) {
      this.cancelPaperForm();
    }
  }

  cancelPaperForm(resetMessage = true) {
    this.showPaperForm = false;
    this.editingPaperId = null;
    this.paperTitle = '';
    this.paperAbstract = '';
    this.paperKeywords = '';
    this.paperCorrespondingEmail = '';
    this.paperConference = '';
    this.paperPublicationDate = '';
    this.paperStatus = 'draft';
    this.paperImageFile = null;
    this.paperPdfFile = null;

    if (resetMessage) {
      this.paperFormMessage = 'Fill the form to create a paper.';
    }
  }

  canManageResearcher(researcher: any): boolean {
    return this.isAdmin() || this.belongsToCurrentUser(researcher);
  }

  canManagePaper(paper: any): boolean {
    if (this.isAdmin()) {
      return true;
    }

    const currentResearcher = this.getCurrentUserResearcher();

    if (!currentResearcher) {
      return false;
    }

    const authors = paper?.authors || paper?.author || [];
    const authorList = Array.isArray(authors) ? authors : [authors];

    return authorList.some((author) => {
      const authorId = typeof author === 'object'
        ? String(author.id || '')
        : String(author);

      return authorId === String(currentResearcher.id);
    });
  }

  getCurrentUserResearcher(): any {
    if (!this.currentUser) {
      return null;
    }

    return this.researchers.find((researcher) => {
      const researcherUser = researcher.user;

      if (typeof researcherUser === 'object' && researcherUser) {
        return String(researcherUser.id || '') === String(this.currentUser.id || '')
          || String(researcherUser.username || '') === String(this.currentUser.username || '')
          || String(researcherUser.email || '') === String(this.currentUser.email || '');
      }

      return String(researcherUser || '') === String(this.currentUser.id || '')
        || String(researcher.username || '') === String(this.currentUser.username || '')
        || String(researcher.email || '') === String(this.currentUser.email || '');
    });
  }

  getDepartmentName(departmentValue: any): string {
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

  private normalizeList(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.results)) {
      return response.results;
    }

    return [];
  }

  private extractId(value: any): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'object') {
      return String(value.id || '');
    }

    return String(value);
  }

  private readStoredUser(): any {
    const storedUser = localStorage.getItem('currentUser');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }

  private belongsToCurrentUser(item: any): boolean {
    if (!this.currentUser || !item) {
      return false;
    }

    const currentUserId = String(this.currentUser.id || '');
    const currentUsername = String(this.currentUser.username || '');
    const currentEmail = String(this.currentUser.email || '');
    const itemUser = item.user;

    if (typeof itemUser === 'object' && itemUser) {
      return String(itemUser.id || '') === currentUserId
        || String(itemUser.username || '') === currentUsername
        || String(itemUser.email || '') === currentEmail;
    }

    return String(itemUser || '') === currentUserId
      || String(item.username || '') === currentUsername
      || String(item.email || '') === currentEmail
      || String(item.user_id || '') === currentUserId;
  }

  get filteredDepartments(): any[] {
    const search = this.departmentSearch.toLowerCase().trim();

    if (!search) {
      return this.departments;
    }

    return this.departments.filter((department) => {
      return (
        String(department.name || '').toLowerCase().includes(search) ||
        String(department.code || '').toLowerCase().includes(search) ||
        String(department.description || '').toLowerCase().includes(search) ||
        String(department.contact_email || '').toLowerCase().includes(search)
      );
    });
  }

  get filteredResearchers(): any[] {
    const search = this.researcherSearch.toLowerCase().trim();

    return this.researchers.filter((researcher) => {
      const rank = String(researcher.academic_rank || researcher.rank || '');
      const departmentId = String(this.extractId(researcher.department));

      const matchesSearch =
        !search ||
        String(researcher.first_name || '').toLowerCase().includes(search) ||
        String(researcher.last_name || '').toLowerCase().includes(search) ||
        String(researcher.email || '').toLowerCase().includes(search) ||
        String(researcher.biography || researcher.bio || '').toLowerCase().includes(search) ||
        String(this.getDepartmentName(researcher.department) || '').toLowerCase().includes(search);

      const matchesRank =
        !this.researcherRankFilter ||
        rank === this.researcherRankFilter;

      const matchesDepartment =
        !this.researcherDepartmentFilter ||
        departmentId === String(this.researcherDepartmentFilter);

      return matchesSearch && matchesRank && matchesDepartment;
    });
  }

  get filteredConferences(): any[] {
    const search = this.conferenceSearch.toLowerCase().trim();

    if (!search) {
      return this.conferences;
    }

    return this.conferences.filter((conference) => {
      return (
        String(conference.name || '').toLowerCase().includes(search) ||
        String(conference.location || '').toLowerCase().includes(search) ||
        String(conference.description || '').toLowerCase().includes(search) ||
        String(conference.contact_email || '').toLowerCase().includes(search)
      );
    });
  }

  getAcademicRankLabel(rank: string): string {
    const ranks: any = {
      student: 'Graduate Student',
      lecturer: 'Lecturer',
      assistant: 'Assistant Professor',
      associate: 'Associate Professor',
      professor: 'Professor'
    };

    return ranks[rank] || rank || 'Not provided';
  }

  get filteredPapers(): any[] {
    const search = this.paperSearch.toLowerCase().trim();

    return this.papers.filter((paper) => {
      const conferenceId = String(this.extractId(paper.conference));

      const matchesSearch =
        !search ||
        String(paper.title || '').toLowerCase().includes(search) ||
        String(paper.abstract || '').toLowerCase().includes(search) ||
        String(paper.keywords || '').toLowerCase().includes(search) ||
        String(paper.corresponding_email || '').toLowerCase().includes(search) ||
        String(paper.status || '').toLowerCase().includes(search) ||
        String(this.getConferenceName(paper.conference) || '').toLowerCase().includes(search);

      const matchesStatus =
        !this.paperStatusFilter ||
        String(paper.status || '') === this.paperStatusFilter;

      const matchesConference =
        !this.paperConferenceFilter ||
        conferenceId === String(this.paperConferenceFilter);

      return matchesSearch && matchesStatus && matchesConference;
    });
  }

  private formatError(error: any): string {
    return JSON.stringify(error?.error || error?.message || error, null, 2);
  }
}