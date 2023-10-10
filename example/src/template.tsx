export function template({
	lang,
	title,
	content,
	contentTypo,
}: {
	lang: string;
	title: string;
	content: string;
	contentTypo: string;
}) {
	return `<html lang="${lang}">
			<head>
				<meta charset="utf-8" />
				<title>${title}</title>
				<link
					href="https://fonts.googleapis.com/css?family=Vollkorn:400,400i,700i&amp;subset=cyrillic,latin-ext"
					rel="stylesheet"
				/>
				<link href="example.css" rel="stylesheet" />
			</head>
			<body>
				<main role="main" class="content">
					<div class="content__column">${content}</div>
					<div class="content__column">${contentTypo}</div>
				</main>
			</body>
		</html>`;
}
