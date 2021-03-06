import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { Wrapper, Section, Heading } from 'common/base';
import IconHeadingBlock from 'common/IconHeadingBlock';
import Loader from 'common/Loader';
import { Comment2 } from 'common/icons';

import styles from './Me.module.css';
import ShareBlockElement from './ShareBlockElement';
import status from '../../constants/status';

class Me extends Component {
  static propTypes = {
    fetchMyExperiences: PropTypes.func.isRequired,
    fetchMyWorkings: PropTypes.func.isRequired,
    fetchMyReplies: PropTypes.func.isRequired,
    setExperienceStatus: PropTypes.func.isRequired,
    setWorkingStatus: PropTypes.func.isRequired,
    setReplyStatus: PropTypes.func.isRequired,
    me: ImmutablePropTypes.map.isRequired,
  };

  componentDidMount() {
    this.props.fetchMyExperiences();
    this.props.fetchMyWorkings();
    this.props.fetchMyReplies();
  }

  login = () => {
    const { login, FB } = this.props;
    FB && login(FB);
  };

  render() {
    const { me } = this.props;
    const data = me.toJS();
    const { experiences } = data.myExperiences;
    const workings = data.myWorkings.time_and_salary;
    const { replies } = data.myReplies;

    return (
      <Section pageTop paddingBottom>
        <Wrapper size="m">
          {this.props.auth.getIn(['user', 'name']) === null && (
            <div>
              <Heading size="l" center>
                登入以查看個人頁面
              </Heading>
              <div className={styles.loginBtnSection}>
                <button
                  className="buttonCircleM buttonBlackLine"
                  onClick={this.login}
                >
                  facebook 登入
                </button>
              </div>
            </div>
          )}
          {this.props.auth.getIn(['user', 'name']) !== null && (
            <div>
              <Heading size="l" center>
                {this.props.auth.getIn(['user', 'name'])}
                &nbsp;&nbsp;的個人頁面
              </Heading>
              <IconHeadingBlock
                heading="我分享的資料"
                Icon={Comment2}
                marginTop
                noPadding
              >
                <div>
                  {data.myExperiencesStatus === status.FETCHING ? (
                    <Loader size="s" />
                  ) : (
                    (experiences || []).map(o => (
                      <ShareBlockElement
                        key={o._id}
                        type={o.type === 'work' ? '工作' : '面試'}
                        heading={o.title}
                        to={`/experiences/${o._id}?backable=true`}
                        disabled={
                          o.status === 'hidden' ||
                          (o.archive && o.archive.is_archived)
                        }
                        publishHandler={() => {
                          this.props.setExperienceStatus(o);
                        }}
                        archive={o.archive}
                      />
                    ))
                  )}
                  {data.myWorkingsStatus === status.FETCHING ? (
                    <Loader size="s" />
                  ) : (
                    (workings || []).map(o => (
                      <ShareBlockElement
                        key={o._id}
                        type="薪時"
                        heading={o.company.name}
                        position={o.job_title}
                        to={o.company.name}
                        disabled={
                          o.status === 'hidden' ||
                          (o.archive && o.archive.is_archived)
                        }
                        publishHandler={() => {
                          this.props.setWorkingStatus(o);
                        }}
                        archive={o.archive}
                      />
                    ))
                  )}
                  {data.myRepliesStatus === status.FETCHING ? (
                    <Loader size="s" />
                  ) : (
                    (replies || []).map(o => (
                      <ShareBlockElement
                        key={o._id}
                        type="留言"
                        heading={o.experience.title}
                        comment={o.content}
                        to={`/experiences/${o.experience._id}`}
                        disabled={
                          o.status === 'hidden' ||
                          (o.archive && o.archive.is_archived)
                        }
                        publishHandler={() => {
                          this.props.setReplyStatus(o);
                        }}
                        options={{ replyId: o._id }}
                        archive={o.archive}
                      />
                    ))
                  )}
                </div>
              </IconHeadingBlock>
            </div>
          )}
        </Wrapper>
      </Section>
    );
  }
}
Me.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object,
  FB: PropTypes.object,
};

export default Me;
