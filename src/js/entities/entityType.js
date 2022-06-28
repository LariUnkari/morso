const EntityType = {
  Unassigned: 0,
  Player: 1,
  Enemy: 2,
  Monster: 4,
  MonsterEgg: 4 + 1,
  MonsterSmall: 4 + 2,
  MonsterBig: 4 + 3
};

const EntityIds = [
  "None",         // 0
  "Player",       // 1
  "Enemies",      // 2
  "",             // 3
  "Monsters",     // 4
  "MonsterEgg",   // 5
  "MonsterSmall", // 6
  "MonsterBig"    // 7
];

export { EntityType, EntityIds };
