import React from 'react';

import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS';
import Analyzer from 'Parser/Core/Analyzer';
import calculateEffectiveHealing from 'Parser/Core/calculateEffectiveHealing';
import ItemHealingDone from 'Interface/Others/ItemHealingDone';

const LEGENDARY_JONAT_BUFF = 210607;
const LEGENDARY_JONAT_HEALING_INCREASE_PER_STACK = 0.10;
const LEGENDARY_JONAT_BUFF_EXPIRATION_BUFFER = 50; // the buff expiration can occur several MS before the heal event is logged, this is the buffer time that an IoL charge may have dropped during which it will still be considered active.

class Jonat extends Analyzer {
  healing = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasFinger(ITEMS.FOCUSER_OF_JONAT.id);
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;

    if (spellId !== SPELLS.CHAIN_HEAL.id) {
      return;
    }

    const buff = this.selectedCombatant.getBuff(LEGENDARY_JONAT_BUFF, event.timestamp, LEGENDARY_JONAT_BUFF_EXPIRATION_BUFFER);

    if (buff) {
      const stacks = buff.stacks || 1;
      const healingIncrease = stacks * LEGENDARY_JONAT_HEALING_INCREASE_PER_STACK;
      this.healing += calculateEffectiveHealing(event, healingIncrease);
    }
  }

  item() {
    return {
      item: ITEMS.FOCUSER_OF_JONAT,
      result: <ItemHealingDone amount={this.healing} />,
    };
  }

}

export default Jonat;
