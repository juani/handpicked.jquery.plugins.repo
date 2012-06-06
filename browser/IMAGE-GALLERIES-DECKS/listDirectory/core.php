<?php
/////////////////////////////////////////////
//         ScanDirScript By Jaybuz
/////////////////////////////////////////////

function dirContents($dir = './')
{
	include_once('config.php');
	
	$origDir = $dir;
	$urlDir = isset($_GET['d']) ? stripslashes(trim($_GET['d'], '/')) : '';
	
	// Add a slash to the end of the path if not present
	if ($urlDir && substr($urlDir, -1) != '/') { $urlDir = $urlDir.'/'; }
	$dir = $dir.$urlDir;
	
	//Check for errors
	if (substr_count($urlDir, '..') > 0)
	{ return '<div class="cont error">You don\'t have permession to access this folder!</div>'."\n"; }
	
	if (!is_dir($dir))
	{ return '<div class="cont error">Error, directory does not exist!</div>'."\n"; }
	
	// Add the directory to the ignored file paths
	foreach ($fileIgnore as $item)
	{
		array_push($fileIgnore, $origDir.$item);
	}
	
	// Scan and sort
	$itemArray = scandir($dir);
	natcasesort($itemArray);
	
	// Set variables
	$folders = '';
	$files = '';
	$folderCount = 0;
	$fileCount = 0;
	
	foreach ($itemArray as $item)
	{
		// Skip unneeded folders
		if ($item == '.' || $item == '..') continue;
		if (in_array($item, $folderIgnore)) continue;
		if (in_array($dir.$item, $fileIgnore)) continue;
		
		// Sanitise the link
		$link = htmlentities($item);
		
		if (is_dir($dir.$item))
		{
			$folderCount++;
		
			//Count the number of files and folders that are within the dirctory
			$fileFCount = countFiles($dir.$item, $fileIgnore);
			$folderFCount = countFolders($dir.$item, $folderIgnore);
			
			// If no files it will display empty || If no folders it will show files
			$fileCountStr = ($fileFCount > 0) ? $fileFCount.' file'.(($fileFCount != 1) ? 's' : '') : 'Empty';
			$ItemCountStr = ($folderFCount > 0) ? $folderFCount.'  folder'.(($folderFCount != 1) ? 's' : '') : $fileCountStr;
			
			$folders .= '<li><span>'.$ItemCountStr.'</span><a href="?d='.$urlDir.$link.'">'.$item.'</a></li>'."\n";
		}
		else
		{
			$fileCount++;
			
			// Grab the files extention and size
			$itemExt = strtolower(substr(strrchr($item, '.'), 1));
			$itemSize = filesize($dir.$item);
			
			if (!in_array($itemExt, array_keys($icons)))
			{
				// Add default icon and continue to next item
				$files .= '<li class="file"><span>'.formatSize($itemSize).'</span><a href="'.$dir.$link.'">'.$item.'</a></li>'."\n";
				continue;
			}
			
			// Match extention with its class to show the file icon
			foreach ($icons as $ext => $class)
			{
				if ($itemExt == $ext)
				{
					$files .= '<li class="'.$class.'"><span>'.formatSize($itemSize).'</span><a href="'.$dir.$link.'">'.$item.'</a></li>'."\n";
				}
			}
		}
	}
	
	// Grab the URI and make the breadcrumb path with links
	$pathParts = explode('/', urldecode($urlDir));
	$pathCount = count($pathParts)-1;
	$path = ($pathCount == 0) ? '<a href="./" class="current">Home</a> / ' : '<a href="./">Home</a> / ';
	$pathLink = '';
	
	for ($i = 0; $i < $pathCount; $i++)
	{
		$pathLink .= $pathParts[$i].'/';
		$path .= ($i == $pathCount-1) ? '<a href="?d='.$pathLink.'" class="current">'.$pathParts[$i].'</a>' : '<a href="?d='.$pathLink.'">'.$pathParts[$i].'</a> / ';
	}
	
	// Make the navigation and file/folder lists
	$navi = '<div class="cont">'."\n".'<div class="navi">'.$path.'</div>'."\n</div>\n";
	$folders = $folders ? '<div class="cont">'."\n".'<div class="count"><span>'.$folderCount.' folder(s)</span><a onclick="$(\'.folders li\').reverseOrder()">Name</a></div>'."\n".'<ul class="folders">'."\n".$folders."</ul>\n</div>\n" : '';
	$files = $files ? '<div class="cont">'."\n".'<div class="count"><span>'.$fileCount.' file(s)</span><a onclick="$(\'.files li\').reverseOrder()">Name</a></div>'."\n".'<ul class="files">'."\n".$files."</ul>\n</div>\n" : '';
	
	// Display them
	if ($folders || $files)
	{
		return $navi.$folders.$files;
	}
	else
	{
		return $navi.'<ul class="cont empty"><li class="count"><span>0 file(s)</span>Name</li>'."\n<li>No files or folders to display in here.\n</li>\n</ul>\n";
	}
}

function countFiles($curDir, $files)
{
	$hide = 0;
	$contents = scandir($curDir);
	foreach($contents as $item)
	{
		if (is_dir($curDir.'/'.$item) || in_array($curDir.'/'.$item, $files))
		$hide++;
	}
	$count = count($contents)-$hide;
	return $count;
}

function countFolders($curDir, $folders)
{
	$hide = 0;
	$contents = scandir($curDir);
	foreach($contents as $item)
	{
		if (is_file($curDir.'/'.$item) || in_array($item, $folders) || $item == '.' || $item == '..')
		$hide++;
	}
	$count = count($contents)-$hide;
	return $count;
}

function formatSize($size, $round = 1)
{
	$units = array('Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
	for ($i = 0; $size > 1024 && $i < 8; $i++) $size /= 1024;
	return ($i < 2 ? round($size, 0) : round($size, $round)).' '.$units[$i];
}
?>