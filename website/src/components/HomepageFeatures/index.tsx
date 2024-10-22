import { useColorMode } from '@docusaurus/theme-common';
import Heading from '@theme/Heading';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  DarkSvg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Decentralized',
    Svg: require('@site/static/img/decentralized-light.svg').default,
    DarkSvg: require('@site/static/img/decentralized-dark.svg').default,
    description: (
      <>
        Amos uses atomic state nodes (Box) and lazy loading, which can also be used in asynchronous
        chunks. You don't need to aggregate all the state nodes at the application entry point,
        while still retaining all the features expected from a state management library.
      </>
    ),
  },
  {
    title: 'Data driven',
    Svg: require('@site/static/img/data-driven-light.svg').default,
    DarkSvg: require('@site/static/img/data-driven-dark.svg').default,
    description: (
      <>
        By encapsulating operations on the data structure of state nodes, you don't need to
        reimplement basic operations for all states. Focus on your business model and operations
        instead.
      </>
    ),
  },
  {
    title: 'Full featured',
    Svg: require('@site/static/img/full-featured-light.svg').default,
    DarkSvg: require('@site/static/img/full-featured-dark.svg').default,
    description: (
      <>
        The amos package provides everything you need—no plugins, no extensions, ready to use out of
        the box. It includes features such as persistence, async handling, caching, and Suspense,
        all built-in.
      </>
    ),
  },
  {
    title: 'Ease to use',
    Svg: require('@site/static/img/ease-to-use-light.svg').default,
    DarkSvg: require('@site/static/img/ease-to-use-dark.svg').default,
    description: (
      <>
        There are only the core concepts in the state management library: Store, Box, Mutation, and
        Action, nothing more.
      </>
    ),
  },
];

function Feature({ title, Svg, DarkSvg, description }: FeatureItem) {
  const color = useColorMode();
  const Icon = color.colorMode === 'dark' ? DarkSvg : Svg;
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <Icon className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
