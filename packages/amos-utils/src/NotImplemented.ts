/*
 * @since 2022-01-10 16:46:54
 * @author junbao <junbao@moego.pet>
 */

export class NotImplemented extends Error {
  constructor() {
    super('not implemented');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
