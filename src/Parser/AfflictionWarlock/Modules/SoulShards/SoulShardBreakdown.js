import React from 'react';
import PropTypes from 'prop-types';

import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';

class SoulShardBreakdown extends React.Component {
  static propTypes = {
    shardsGained: PropTypes.object.isRequired,
    shardsSpent: PropTypes.object.isRequired,
    shardsWasted: PropTypes.object.isRequired,
  };
  prepareGenerated(shardGen, shardWasted){
    //shardGen and shardWasted has the same number of abilities (some having 0, these can be now filtered)
    const abilities = [];
    Object.keys(shardGen).map(abilityId => abilities.push({abilityId: Number(abilityId), generated: shardGen[abilityId].shards, wasted: shardWasted[abilityId].shards}));
    abilities.sort((a, b) => b.generated - a.generated);
    return abilities;
  }
  prepareSpent(shardSpent) {
    const abilities = [];
    Object.keys(shardSpent).map(abilityId => abilities.push({abilityId: Number(abilityId), spent: shardSpent[abilityId].shards}));
    abilities.sort((a, b) => b.spent - a.spent);
    return abilities;
  }
  render() {
    const { shardsGained, shardsSpent, shardsWasted } = this.props;
    const generated = this.prepareGenerated(shardsGained, shardsWasted);
    const spent = this.prepareSpent(shardsSpent);

    let totalGenerated = 0;
    let totalWasted = 0;
    let totalSpent = 0;
    generated.forEach(ability => {
      totalGenerated += ability.generated;
      totalWasted += ability.wasted;
    });
    spent.forEach(ability => totalSpent += ability.spent);
    //looks wrong but totals are only for the purpose of percentage, and if nothing was wasted, then 0/1 gives correct result 0% wasted, if it's not 0 it retains its original value
    totalGenerated = (totalGenerated === 0) ? 1 : totalGenerated;
    totalWasted = (totalWasted === 0) ? 1 : totalWasted;
    totalSpent = (totalSpent === 0) ? 1 : totalSpent;

    return (
      <div>
        <table className='data-table'>
          <thead>
            <tr>
              <th>Ability</th>
              <th colSpan='2'>Shards generated</th>
              <th colSpan='2'><dfn data-tip='This is the amount of shards that were generated while you were having full shards.'>Shards wasted</dfn></th>
            </tr>
          </thead>
          <tbody>
            {generated && generated
              .map(ability => {
                return (
                  <tr>
                    <td style={{ width: '30%'}}>
                      <SpellIcon id={ability.abilityId}/>{' '}
                      <SpellLink id={ability.abilityId}/>
                    </td>
                    <td style={{ width: 50, paddingRight: 5, textAlign: 'right' }}>
                      <dfn data-tip={`${formatPercentage(ability.generated / totalGenerated)} %`}>{ability.generated}</dfn>
                    </td>
                    <td style={{ width: '40%' }}>
                      <div
                        className={`performance-bar`}
                        style={{ width: `${(ability.generated / totalGenerated) * 100}%` }}
                      />
                    </td>
                    <td style={{ width: 50, paddingRight: 5, textAlign: 'right' }}>
                      <dfn data-tip={`${formatPercentage(ability.wasted / totalWasted)} %`}>{ability.wasted}</dfn>
                    </td>
                    <td style={{ width: '30%' }}>
                      <div
                        className={`performance-bar `}
                        style={{ width: `${(ability.wasted / totalWasted) * 100}%` }}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <table className='data-table'>
          <thead>
          <tr>
            <th>Ability</th>
            <th colSpan='2'>Shards spent</th>
            {/* I know it shouldn't be done like this but I'm not proficient with CSS and this is the only way I could think of to align the columns with table above*/}
            <th colSpan='2'></th>
          </tr>
          </thead>
          <tbody>
          {spent && spent
            .map(ability => {
              return (
                <tr>
                  <td style={{ width: '30%'}}>
                    <SpellIcon id={ability.abilityId}/>{' '}
                    <SpellLink id={ability.abilityId}/>
                  </td>
                  <td style={{ width: 50, paddingRight: 5, textAlign: 'right' }}>
                    <dfn data-tip={`${formatPercentage(ability.spent / totalGenerated)} %`}>{ability.spent}</dfn>
                  </td>
                  <td style={{ width: '40%' }}>
                    <div
                      className={`performance-bar`}
                      style={{ width: `${(ability.spent / totalSpent) * 100}%` }}
                    />
                  </td>
                  <td style={{ width: 50, paddingRight: 5, textAlign: 'right' }}></td>
                  <td style={{ width: '30%' }}></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    );
  }
}

export default SoulShardBreakdown;
