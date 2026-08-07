'use client';

import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, Label, ReadMore } from '@navikt/ds-react';
import ScanningIcon from 'components/ScanningGuide/ScanningIcon';
import { scrollRefIntoView } from 'lib/utils/dom';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import styles from './ScanningGuide.module.css';

export const ScanningGuide = () => {
  const t = useTranslations();
  const [scanningGuideOpen, setScanningGuideOpen] = useState(false);
  const scanningGuideElement = useRef(null);

  useEffect(() => {
    if (scanningGuideOpen) {
      if (scanningGuideElement?.current != null) scrollRefIntoView(scanningGuideElement);
    }
  }, [scanningGuideOpen]);
  return (
    <div>
      <BodyLong>{t('vedleggPåPapir.text')}</BodyLong>
      <ReadMore
        header={t('vedleggPåPapir.readMore.title')}
        type={'button'}
        open={scanningGuideOpen}
        onClick={() => setScanningGuideOpen(!scanningGuideOpen)}
        ref={scanningGuideElement}
      >
        <div className={styles.scanningGuide}>
          <article>
            <Label as="p" spacing>
              {t('scanningGuide.alert.takePictureTitle')}
            </Label>
            <ul>
              <li>{t('scanningGuide.alert.bulletPointTakePicture1')}</li>
              <li>{t('scanningGuide.alert.bulletPointTakePicture2')}</li>
              <li>{t('scanningGuide.alert.bulletPointTakePicture3')}</li>
            </ul>
            <Label as="p" spacing>
              {t('scanningGuide.alert.checkPictureTitle')}
            </Label>
            <ul>
              <li>{t('scanningGuide.alert.bulletPointCheckPicture1')}</li>
              <li>{t('scanningGuide.alert.bulletPointCheckPicture2')}</li>
              <li>{t('scanningGuide.alert.bulletPointCheckPicture3')}</li>
            </ul>
            <Label as="p" spacing>
              {t('scanningGuide.alert.examplesPicturesTitle')}
            </Label>
          </article>
          <ul className={styles.scanningExamples}>
            <li className={styles.scanningExample}>
              <ScanningIcon status={'good'} title={t('scanningGuide.alert.exampleLabelGood')} />
              <div className={styles.scanningExampleItem}>
                <span className={styles.scanningExampleStatus}>
                  <CheckmarkCircleIcon color={'var(--a-green-600)'} />
                  <Label as="span">{t('scanningGuide.alert.exampleLabelGood')}</Label>
                </span>
                <BodyShort>{t('scanningGuide.alert.exampleGood')}</BodyShort>
              </div>
            </li>
            <li className={styles.scanningExample}>
              <ScanningIcon status={'keystone'} title={t('scanningGuide.alert.exampleLabelBad')} />
              <div className={styles.scanningExampleItem}>
                <span className={styles.scanningExampleStatus}>
                  <XMarkOctagonIcon color={'var(--a-nav-red)'} />
                  <Label as="span">{t('scanningGuide.alert.exampleLabelBad')}</Label>
                </span>
                <BodyShort>{t('scanningGuide.alert.exampleKeystone')}</BodyShort>
              </div>
            </li>
            <li className={styles.scanningExample}>
              <ScanningIcon status={'horizontal'} title={t('scanningGuide.alert.exampleLabelBad')} />
              <div className={styles.scanningExampleItem}>
                <span className={styles.scanningExampleStatus}>
                  <XMarkOctagonIcon color={'var(--a-nav-red)'} />
                  <Label as="span">{t('scanningGuide.alert.exampleLabelBad')}</Label>
                </span>
                <BodyShort>{t('scanningGuide.alert.exampleHorizontal')}</BodyShort>
              </div>
            </li>
            <li className={styles.scanningExample}>
              <ScanningIcon status={'shadow'} title={t('scanningGuide.alert.exampleLabelBad')} />
              <div className={styles.scanningExampleItem}>
                <span className={styles.scanningExampleStatus}>
                  <XMarkOctagonIcon color={'var(--a-nav-red)'} />
                  <Label as="span">{t('scanningGuide.alert.exampleLabelBad')}</Label>
                </span>
                <BodyShort>{t('scanningGuide.alert.exampleShaddow')}</BodyShort>
              </div>
            </li>
          </ul>
        </div>
      </ReadMore>
    </div>
  );
};
