import React from "react";

export default function FriendshipDisplay({ characters }) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Friendship Levels</h3>
      {characters.map((character) => (
        <div key={character.name} style={styles.character}>
          <p style={styles.name}>{character.name}</p>
          <ul style={styles.list}>
            {Object.entries(character.friendshipIndex).map(([otherCharacter, points]) => (
              <li key={otherCharacter} style={styles.item}>
                {otherCharacter}: <span style={styles.points}>{points}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    top: "20px",
    left: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    padding: "10px",
    borderRadius: "10px",
    fontFamily: "Arial, sans-serif",
    zIndex: 1000,
  },
  title: {
    margin: "0 0 10px 0",
    fontSize: "18px",
  },
  character: {
    marginBottom: "10px",
  },
  name: {
    margin: "0 0 5px 0",
    fontWeight: "bold",
  },
  list: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  item: {
    margin: "5px 10px",
  },
  points: {
    fontWeight: "bold",
    color: "#ffcc00",
  },
};