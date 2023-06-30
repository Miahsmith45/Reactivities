import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from './models/activity';
import NavBar from './navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedACtivity] = useState<Activity | undefined>(undefined)
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
      .then(response => {
        setActivities(response.data);
      })

  }, [])

  function HandleSelectActivity(id: string) {
    setSelectedACtivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedACtivity(undefined)
  }
  function handleFormOpen(id?:string) {
    id ? HandleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);    
  }
  
function handleCreateOrEditActivity(activity:Activity){
  activity.id
   ? setActivities([...activities.filter(e=>e.id !== activity.id), activity])
   : setActivities([...activities, {...activity, id: crypto.randomUUID()}]);
   setEditMode(false);
   setSelectedACtivity(activity);
}
function handleDeleteActivity(id: string) {
  setActivities([...activities.filter(e=>e.id !== id)])
}
  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={HandleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
        />

      </Container>
    </>
  );
}

export default App;
