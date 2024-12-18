import Script from 'next/script';

const FacebookPixel = ({ fbPixel }) => {
	const fbScript = `<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${fbPixel});
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${fbPixel}&ev=PageView&noscript=1"
/></noscript>`;

	function getScriptBody(htmlScript) {
		if (!htmlScript) {
			return [];
		}
		const scriptRegex = /<script>([\s\S]*?)<\/script>/;
		const noscriptRegex = /<noscript>([\s\S]*?)<\/noscript>/;

		const scriptMatch = htmlScript.match(scriptRegex);
		const noscriptMatch = htmlScript.match(noscriptRegex);

		const scriptContent = scriptMatch && scriptMatch[1];
		const noscriptContent = noscriptMatch && noscriptMatch[1];

		return [scriptContent, noscriptContent];
	}
	const [scriptContent, noscriptContent] = getScriptBody(fbScript);
	return (
		<>
			{scriptContent && (
				<Script
					id='facebookPixel'
					strategy='afterInteractive'
					dangerouslySetInnerHTML={{
						__html: `${scriptContent}`,
					}}
				/>
			)}
			{noscriptContent && <noscript>{noscriptContent}</noscript>}
		</>
	);
};

export default FacebookPixel;
