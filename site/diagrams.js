import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  themeVariables: {
    primaryColor: '#edf2e9', primaryTextColor: '#244638', primaryBorderColor: '#89a28b',
    lineColor: '#79907c', secondaryColor: '#f5f1e7', tertiaryColor: '#f9f8f3',
    fontFamily: 'system-ui, sans-serif',
  },
});
mermaid.run({ querySelector: '.mermaid' }).catch(() => {
  const notice = document.getElementById('diagram-notice');
  if (notice) notice.hidden = false;
});
