import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { Project } from '../types/project';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // We need to make sure the user is authenticated before we try to fetch their projects.
    // onAuthStateChanged will let us know when the user is logged in.
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        // Now that we have the user, we can create a query to get their projects.
        const projectsCollection = collection(db, 'projects');
        const q = query(projectsCollection, where('userId', '==', user.uid));

        // onSnapshot will listen for real-time updates to the projects collection.
        // This means that if a project is added, removed, or updated, our UI will update automatically.
        const unsubscribeSnapshot = onSnapshot(
          q,
          snapshot => {
            // We map over the documents in the snapshot to get the data for each project.
            const userProjects = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            })) as Project[];

            // We sort the projects by their event date, so the most recent projects are first.
            const sortedProjects = userProjects.sort(
              (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
            );

            setProjects(sortedProjects);
            setLoading(false);
          },
          err => {
            // If there's an error, we'll set the error state and log the error to the console.
            setError(err);
            console.error('Error fetching projects:', err);
            setLoading(false);
          }
        );

        // We return the unsubscribe function from onSnapshot so that we can clean up the listener when the component unmounts.
        return () => unsubscribeSnapshot();
      } else {
        // If there is no user, we'll set the projects to an empty array and stop loading.
        setProjects([]);
        setLoading(false);
      }
    });

    // We return the unsubscribe function from onAuthStateChanged so that we can clean up the listener when the component unmounts.
    return () => unsubscribeAuth();
  }, []);

  return { projects, loading, error };
};
