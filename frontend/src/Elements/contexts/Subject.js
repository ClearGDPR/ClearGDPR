import _ from 'lodash';
import { DATA_ERASED, DATA_STATUS } from '../constants';

export default class Subject {
  constructor(
    cg,
    {
      isFetched = false,
      isLoading = false,
      isErased = false,
      data = null,
      status = null,
      processors = null,
      objection = null,
      shares = null,
      restrictions = null,
      isGuest = true,
      propagateMutation
    }
  ) {
    this.cg = cg;

    this.isFetched = isFetched;
    this.isLoading = isLoading;
    this.isErased = isErased;
    this.data = data;
    this.status = status;
    this.processors = processors;
    this.objection = objection;
    this.shares = shares;
    this.restrictions = restrictions;
    this.isGuest = isGuest;

    this._propagateMutation = () => {
      propagateMutation(new Subject(cg, { ...this, propagateMutation }));
    };
  }

  async fetchData() {
    const { isLoading, isFetched, isGuest } = this;

    if (isLoading || isFetched || isGuest) {
      return;
    }

    this.isLoading = true;

    let data;
    let status;

    try {
      status = await this.cg.Subject.getDataStatus();
    } catch (e) {
      status = null;
    }

    const isErased = !status || status.controller === DATA_ERASED;

    if (!isErased) {
      try {
        data = await this.cg.Subject.accessData();
      } catch (e) {
        data = null;
      }
    }

    this.data = data;
    this.isLoading = false;
    this.isFetched = true;
    this.isErased = isErased;
    this.status = status;

    this._propagateMutation();
  }

  async fetchProcessors() {
    if (this.processors) {
      return;
    }

    let processors;
    try {
      processors = await this.cg.Subject.getProcessors();
    } catch (e) {
      console.log('failure', e);
      return;
    }

    this.processors = processors.map(p => {
      p.enabled = true;

      if (this.status) {
        const s = _.find(this.status.processors, { id: p.id }) || {};
        p.status = s.status ? DATA_STATUS[s.status] : DATA_STATUS.UNCONSENTED;
      }

      return p;
    });

    this._propagateMutation();
  }

  async initiateRectification(requestReason, rectificationPayload) {
    return await this.cg.Subject.initiateRectification(requestReason, rectificationPayload);
  }

  async eraseData() {
    await this.cg.Subject.eraseData();
    this.status.controller = DATA_ERASED;
    this.data = null;
    this.isErased = true;
    this._propagateMutation();
  }

  async fetchObjectionStatus() {
    if (this.objection !== null) {
      return;
    }
    const { objection } = await this.cg.Subject.getObjectionStatus();
    this.objection = objection;
    this._propagateMutation();
  }

  async updateObjection(value) {
    await this.cg.Subject.updateObjection(value);
    this.objection = value;
    this._propagateMutation();
  }

  async fetchDataShares() {
    if (this.shares !== null) {
      return;
    }
    try {
      this.shares = await this.cg.Subject.getDataShares();
    } catch (e) {
      console.log('failure', e);
      return;
    }

    this._propagateMutation();
  }

  async addDataShare(name) {
    try {
      await this.cg.Subject.addDataShare({
        name
      });
    } catch (e) {
      console.log(e);
      return;
    }
    this.shares = null;
    this.fetchDataShares();
  }

  async removeDataShare(id) {
    try {
      await this.cg.Subject.removeDataShare(id);
    } catch (e) {
      console.log(e);
      return;
    }
    this.shares = null;
    this.fetchDataShares();
  }

  async fetchRestrictions() {
    if (this.restrictions !== null) {
      return;
    }
    this.restrictions = await this.cg.Subject.getRestrictions();
    this._propagateMutation();
  }

  async updateRestrictions(restrictions) {
    this.restrictions = restrictions;
    this._propagateMutation();

    try {
      await this.cg.Subject.updateRestrictions(restrictions);
    } catch (e) {
      console.log(e);
    }
  }

  async giveConsent(payload) {
    try {
      await this.cg.Subject.giveConsent(payload);
    } catch (e) {
      console.log('failure', e);
    }
  }

  onEntrance(callback) {
    this.cg.Events.subscribe('auth.setAccessToken', callback);
  }

  clearEntranceListeners() {
    this.cg.Events.clear('auth.setAccessToken');
  }
}
