const EntityType = {
  Unassigned: 0,
  Player: 1,
  Enemy: 2,
  MonsterEgg: (1 << 2) + 1,
  MonsterSmall: (1 << 2) + 2,
  MonsterBig: (1 << 2) + 3,
};

export { EntityType };
