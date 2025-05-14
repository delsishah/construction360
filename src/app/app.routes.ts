import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardBodyComponent } from './dashboard-body/dashboard-body.component';
import { MarketingComponent } from './marketing/marketing.component';
import { DesignProcessComponent } from './design-process/design-process.component';
import { SiteSecurityComponent } from './site-security/site-security.component';
import { OperationsComponent } from './operations/operations.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './auth.guard';
import { SurveysComponent } from './surveys/surveys.component';
import { LoginGuard } from './login.guard';
import { ProjectsReportsComponent } from './projects-reports/projects-reports.component';
import { ProjectGoalsComponent } from './project-goals/project-goals.component';

export const routes: Routes = [
    {
        component: LoginComponent,
        path: "login",
        canActivate: [LoginGuard]
    },
    {
        component: SignUpComponent,
        path: "sign-up",
        canActivate: [LoginGuard]
    },
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardBodyComponent
            },
            {
                path: 'surveys',
                component: SurveysComponent
            },
            {
                path: 'projects-reports',
                component: ProjectsReportsComponent
            },
            {
                path: 'project-goals',
                component: ProjectGoalsComponent
            },
            { path: 'marketing', component: MarketingComponent },
            { path: 'design-process', component: DesignProcessComponent },
            { path: 'site-security', component: SiteSecurityComponent },
            { path: 'operations', component: OperationsComponent },
            {
                path: 'app-settings',
                component: SettingsComponent,
                canActivate: [AuthGuard]
            }
        ]
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: "**",
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },

];
