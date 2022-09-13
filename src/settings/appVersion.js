import packageJSON from '../../package.json';

export default function checkAppVersion() {
  const localeStorageVersion = localStorage.getItem('version');

  if (!(localeStorageVersion && localeStorageVersion === packageJSON.version)) {
    localStorage.removeItem('currentListId');
    localStorage.removeItem('user');
    localStorage.removeItem('settings');
    localStorage.removeItem('theme');

    localStorage.setItem('version', packageJSON.version);

    window.location.reload();
  }
}
