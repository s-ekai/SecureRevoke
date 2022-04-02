import '../styles/style.css'
import type { AppProps } from 'next/app'
import { DefaultSeo, NextSeo } from 'next-seo'

function MyApp({ Component, pageProps }: AppProps) {
  return (<div>
    <DefaultSeo
      title="SecureRevoke - Revoke your token allowances on Astar Network"
      description="Safe and Secure Revoke System. You can protect your token balances on Astar Network"
      canonical="https://secure-revoke.com/"
      openGraph={{
        url: "https:///secure-revoke.com/",
        images: [{
          url: "https://revoke.cash/secure-revoke.png",
          width: 1600,
          height: 900,
        }],
        site_name: "SecureRevoke",
        type: "website",
      }}
      twitter={{
        handle: "@SecureRevoke",
        site: "@SecureRevoke",
        cardType: "summary_large_image",
      }}
    />
    <Component {...pageProps} />
  </div>)
}

export default MyApp
