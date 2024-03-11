import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  PinterestIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
  XIcon,
} from "react-share";

import React from "react";

type Props = {
  url: string;
};

const Share = ({ url }: Props) => {
  const components: any = {
    facebook: {
      Button: FacebookShareButton,
      Icon: FacebookIcon,
    },
    twitter: {
      Button: TwitterShareButton,
      Icon: XIcon,
    },
    reddit: {
      Button: RedditShareButton,
      Icon: RedditIcon,
    },

    whatsapp: {
      Button: WhatsappShareButton,
      Icon: WhatsappIcon,
    },
    pinterest: {
      Button: PinterestShareButton,
      Icon: PinterestIcon,
    },
    email: {
      Button: EmailShareButton,
      Icon: EmailIcon,
    },

    telegram: {
      Button: TelegramShareButton,
      Icon: TelegramIcon,
    },
  };
  return (
    <div className="flex flex-row gap-4 flex-wrap mx-auto justify-center items-center px-3">
      {" "}
      {Object.values(components).map((type, idx) => (
        <React.Fragment key={"social_item_" + idx}>
          {/* @ts-ignore */}
          <type.Button url={url}>
            {/* @ts-ignore */}
            <type.Icon size={40} round />
            {/* @ts-ignore */}
          </type.Button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Share;
