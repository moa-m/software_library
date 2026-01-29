import Card from './Card'; // Cardコンポーネントをインポート

const stickersData = [
  {
    imgSrc: '/images/line/pinkcat_main.png',
    imgAlt: '猫好きさん必見！カツラをかぶったユニークな猫のスタンプです。毎日使いやすい、日常的なセリフを集めました。',
    title: (
      <>
        ヅラにゃんの日常♪<span className="badge new-badge">NEW</span>
      </>
    ),
    text: 'ピンクの巻髪カツラをかぶったユニークな猫のスタンプです。',
    link: 'https://line.me/S/sticker/31552679',
    linkText: 'LINEストアで見る',
  },
  {
    imgSrc: '/images/line/idol_main.png',
    imgAlt: '元気系・アニメ風アイドルが、毎日をちょっとだけ明るくしてくれる☆ 応援、励まし、元気づけたい時にぴったり！',
    title: '全力アイドル応援スタンプ♪',
    text: '元気系・アニメ風アイドルが、毎日をちょっとだけ明るくしてくれます！',
    link: 'https://line.me/S/sticker/31221945',
    linkText: 'LINEストアで見る',
  },
  {
    imgSrc: '/images/line/gorth_main.png',
    imgAlt: 'ゴスロリファッションのかわいい女の子。日常使いができるスタンプ。',
    title: 'ゴスロリ少女の日常♪',
    text: 'ゴスロリファッションのかわいい女の子。日常使いができるスタンプです。',
    link: 'https://line.me/S/sticker/30699351',
    linkText: 'LINEストアで見る',
  },
  {
    imgSrc: '/images/line/vampire_main.png',
    imgAlt: 'ちょっぴり危険な小悪魔ヴァンパイア。日常使いができるスタンプ。',
    title: '小悪魔ヴァンパイアの日常♪',
    text: 'ちょっぴり危険な小悪魔ヴァンパイア。日常使いができるスタンプです。',
    link: 'https://line.me/S/sticker/30654386',
    linkText: 'LINEストアで見る',
  },
];

const Stickers = () => {
  return (
    <section id="stickers" className="section bg-light-gray">
      <div className="container">
        <h2 className="section-title fade-in">LINEスタンプ</h2>
        <div className="grid">
          {stickersData.map((sticker, index) => (
            <Card
              key={index}
              imgSrc={sticker.imgSrc}
              imgAlt={sticker.imgAlt}
              title={sticker.title}
              text={sticker.text}
              link={sticker.link}
              linkText={sticker.linkText}
              isSticker={true} // isStickerフラグを渡す
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stickers;
