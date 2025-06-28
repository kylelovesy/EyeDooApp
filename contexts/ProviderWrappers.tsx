import React from 'react';
import { ProjectFormProvider } from './Form1EssentialInfoContext';
import { PersonaFormProvider } from './Form3PersonaContext';
import { Form4PhotosProvider } from './Form4PhotosContext';
import { ProjectProvider } from './ProjectContext';
import { TimelineProvider } from './TimelineContext';

// Base Project Provider - always needed
export const withProjectProvider = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P) => (
    <ProjectProvider>
      <Component {...props} />
    </ProjectProvider>
  );
  WrappedComponent.displayName = `withProjectProvider(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// All Form Providers - for screens that need form editing capabilities
export const withAllFormProviders = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P) => (
    <ProjectProvider>
      <ProjectFormProvider>
        <TimelineProvider>
          <PersonaFormProvider>
            <Form4PhotosProvider>
              <Component {...props} />
            </Form4PhotosProvider>
          </PersonaFormProvider>
        </TimelineProvider>
      </ProjectFormProvider>
    </ProjectProvider>
  );
  WrappedComponent.displayName = `withAllFormProviders(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Essential Form Provider only - for screens that only need project creation
export const withEssentialFormProvider = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P) => (
    <ProjectProvider>
      <ProjectFormProvider>
        <Component {...props} />
      </ProjectFormProvider>
    </ProjectProvider>
  );
  WrappedComponent.displayName = `withEssentialFormProvider(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Dashboard Form Providers - for screens that need editing but not creation
export const withDashboardProviders = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P) => (
    <ProjectProvider>
      <TimelineProvider>
        <PersonaFormProvider>
          <Form4PhotosProvider>
            <Component {...props} />
          </Form4PhotosProvider>
        </PersonaFormProvider>
      </TimelineProvider>
    </ProjectProvider>
  );
  WrappedComponent.displayName = `withDashboardProviders(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Specific form combinations for targeted use cases
export const withTimelineProvider = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P) => (
    <ProjectProvider>
      <TimelineProvider>
        <Component {...props} />
      </TimelineProvider>
    </ProjectProvider>
  );
  WrappedComponent.displayName = `withTimelineProvider(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export const withPersonaProvider = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P) => (
    <ProjectProvider>
      <PersonaFormProvider>
        <Component {...props} />
      </PersonaFormProvider>
    </ProjectProvider>
  );
  WrappedComponent.displayName = `withPersonaProvider(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export const withPhotosProvider = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P) => (
    <ProjectProvider>
      <Form4PhotosProvider>
        <Component {...props} />
      </Form4PhotosProvider>
    </ProjectProvider>
  );
  WrappedComponent.displayName = `withPhotosProvider(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Compound Components Pattern - Alternative approach with proper component definitions
const AllFormProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProjectProvider>
    <ProjectFormProvider>
      <TimelineProvider>
        <PersonaFormProvider>
          <Form4PhotosProvider>
            {children}
          </Form4PhotosProvider>
        </PersonaFormProvider>
      </TimelineProvider>
    </ProjectFormProvider>
  </ProjectProvider>
);
AllFormProviders.displayName = 'FormProviders.All';

const DashboardFormProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProjectProvider>
    <TimelineProvider>
      <PersonaFormProvider>
        <Form4PhotosProvider>
          {children}
        </Form4PhotosProvider>
      </PersonaFormProvider>
    </TimelineProvider>
  </ProjectProvider>
);
DashboardFormProviders.displayName = 'FormProviders.Dashboard';

const EssentialFormProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProjectProvider>
    <ProjectFormProvider>
      {children}
    </ProjectFormProvider>
  </ProjectProvider>
);
EssentialFormProviders.displayName = 'FormProviders.Essential';

const ProjectOnlyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProjectProvider>
    {children}
  </ProjectProvider>
);
ProjectOnlyProvider.displayName = 'FormProviders.Project';

export const FormProviders = {
  All: AllFormProviders,
  Dashboard: DashboardFormProviders,
  Essential: EssentialFormProviders,
  Project: ProjectOnlyProvider,
};

// Component composition helper
export const composeProviders = (...providers: React.ComponentType<{ children: React.ReactNode }>[]) => {
  const ComposedProviders = ({ children }: { children: React.ReactNode }) => {
    return providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    );
  };
  ComposedProviders.displayName = 'ComposedProviders';
  return ComposedProviders;
}; 