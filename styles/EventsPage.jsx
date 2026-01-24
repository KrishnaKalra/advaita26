import React from 'react';
import styles from './Events.module.css';

const EVENTS_DATA = [
  {
    id: 1,
    title: "Snow Ball '84",
    date: "DEC 23, 1984",
    location: "Hawkins Middle Gym",
    desc: "A night of romance and middle school awkwardness. Watch out for inter-dimensional rifts near the punch bowl.",
    image: "https://images.unsplash.com/photo-1533219057257-4bb9ed5d2cc6?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Hellfire Club Meeting",
    date: "TUE NIGHTS",
    location: "The Hideout",
    desc: "Campaign: The Curse of Vecna. Bring your own D20. Casualties are likely. No mouth breathers allowed.",
    image: "https://images.unsplash.com/photo-1614680376593-902f74cc0d41?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Starcourt Summer",
    date: "JULY 04, 1985",
    location: "Starcourt Mall",
    desc: "Celebrate Independence Day at the food court. Grand opening of Scoops Ahoy. Ignore the humming in the basement.",
    image: "https://images.unsplash.com/photo-1572204097183-059728266293?auto=format&fit=crop&q=80&w=800"
  }
];

const EventsPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.ash} />
      
      <header className={styles.header}>
        <p className={styles.subtitle}>Hawkins, Indiana</p>
        <h1 className={styles.title}>The Events</h1>
      </header>

      <div className={styles.eventGrid}>
        {EVENTS_DATA.map((event) => (
          <div key={event.id} className={styles.eventCard}>
            <div className={styles.imageWrapper}>
              <img 
                src={event.image} 
                alt={event.title} 
                className={styles.eventImage} 
              />
            </div>
            
            <div className={styles.content}>
              <span className={styles.date}>{event.date}</span>
              <h2 className={styles.eventTitle}>{event.title}</h2>
              <p className={styles.details}>{event.desc}</p>
              
              <div className={styles.meta}>
                <span>LOC: {event.location}</span>
                <span>ID: 00{event.id}</span>
              </div>
              
              <button className={styles.btn} style={{ marginTop: '1.5rem' }}>
                Enter the Void
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Retro VHS Decorative footer */}
      <footer style={{ 
        marginTop: '6rem', 
        textAlign: 'center', 
        opacity: 0.3, 
        fontFamily: 'monospace',
        fontSize: '0.7rem' 
      }}>
        <p>PLAY ► 00:42:11</p>
        <p>ST.11 // PROPERTY OF DOE LABORATORIES</p>
      </footer>
    </div>
  );
};

export default EventsPage;