const EntityType = {
  Unassigned: 0,
  Player: 1,
  Enemy: 1 << 1,
  MonsterEgg: (1 << 1) + 1,
  MonsterSmall: (1 << 1) + 2,
  MonsterBig: (1 << 1) + 3,
};

export { EntityType };
