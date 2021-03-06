import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import IndicatorStore from '../stores/indicatorStore';
import {joinTeam} from '../actionCreators/teams';
import ApiMixin from '../mixins/apiMixin';
import {t} from '../locale';

const MissingProjectMembership = createReactClass({
  displayName: 'MissingProjectMembership',

  propTypes: {
    organization: PropTypes.object.isRequired,
    team: PropTypes.object.isRequired,
  },

  mixins: [ApiMixin],

  getInitialState() {
    return {
      loading: false,
      error: false,
    };
  },

  joinTeam() {
    this.setState({
      loading: true,
    });

    joinTeam(
      this.api,
      {
        orgId: this.props.organization.slug,
        teamId: this.props.team.slug,
      },
      {
        success: () => {
          this.setState({
            loading: false,
            error: false,
          });
        },
        error: () => {
          this.setState({
            loading: false,
            error: true,
          });
          IndicatorStore.add(
            t('There was an error while trying to leave the team.'),
            'error'
          );
        },
      }
    );
  },

  render() {
    let {organization, team} = this.props;
    let openMembership = organization.features.indexOf('open-membership') !== -1;

    return (
      <div className="container">
        <div className="box alert-box">
          <span className="icon icon-exclamation" />
          <p>{"You're not a member of this project."}</p>
          {openMembership ? (
            <p>{t('To view this data you must first join the %s team.', team.name)}</p>
          ) : (
            <p>
              {t(
                'To view this data you must first request access to the %s team.',
                team.name
              )}
            </p>
          )}
          <p>
            {this.state.loading ? (
              <a className="btn btn-default btn-loading btn-disabled">...</a>
            ) : team.isPending ? (
              <a className="btn btn-default btn-disabled">{t('Request Pending')}</a>
            ) : openMembership ? (
              <a className="btn btn-default" onClick={this.joinTeam}>
                {t('Join Team')}
              </a>
            ) : (
              <a className="btn btn-default" onClick={this.joinTeam}>
                {t('Request Access')}
              </a>
            )}
          </p>
        </div>
      </div>
    );
  },
});

export default MissingProjectMembership;
