import Script from "next/script";
import { env } from "@/env";

const Analytics = () => {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        strategy="lazyOnload"
        id="google-analytics-script-url"
      />

      <Script id="google-analytics-script-code" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', '${env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
            page_path: window.location.pathname,
         });`}
      </Script>

      {env.NEXT_PUBLIC_ENABLE_CLARITY === "true" && (
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
    `,
          }}
        />
      )}
    </>
  );
};

export default Analytics;
