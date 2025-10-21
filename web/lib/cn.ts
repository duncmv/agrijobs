import classNames from 'classnames';

export function cn(...classes: Parameters<typeof classNames>) {
  return classNames(...classes);
}
