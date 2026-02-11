import type { CSSProperties } from 'react';
import Card from '@/components/Card';

const appsData = [
  {
    imgSrc: '/images/notification_memo/feature.png',
    imgAlt: '通知にメモ。アプリのスクリーンショット',
    title: (
      <>
        通知にメモ。<span className="badge update-badge">UPDATE</span>
      </>
    ),
    text: (
      <>
        素早く通知にメモを取れるアプリ。<br />
        スマホの通知をメモとして利用できます。<br />
        過去のメモを再利用したり、テーマカラーを変更できたりします。
      </>
    ),
    link: 'https://play.google.com/store/apps/details?id=moa.more.wiser.instant_notification',
    linkText: 'Google Play で入手',
  },
  {
    imgSrc: '/images/memo_usagi/feature.png',
    imgAlt: 'メモうさぎアプリのスクリーンショット',
    title: 'メモうさぎ',
    text: (
      <>
        うさぎをテーマにした可愛いメモアプリ。<br />
        やわらかなデザインが、忙しい毎日の中に、ほっとするひとときを届けます。<br />
        <br />
      </>
    ),
    link: 'https://play.google.com/store/apps/details?id=moa.more.wiser.memo_usagi',
    linkText: 'Google Play で入手',
  },
];

const Apps = () => {
  return (
    <section id="apps" className="section bg-light-gray">
      <div className="container">
        <h2 className="section-title fade-in">Androidアプリ</h2>
        <div className="grid">
          {appsData.map((app, index) => (
            <Card
              key={index}
              imgSrc={app.imgSrc}
              imgAlt={app.imgAlt}
              title={app.title}
              text={app.text}
              link={app.link}
              linkText={app.linkText}
              style={{ '--delay': `${index * 0.1}s` } as CSSProperties}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Apps;
