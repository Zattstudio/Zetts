<?php  
define("SET_PATH", "/sets"); //path for set-files



// Read metadata from set file
function readSetMeta($file)
{

	// Handle file not found
	if(!file_exists($file)) die ("File \"".$file."\" not found!");
	//Read Meta file of set
	$f = fopen($file, 'r');
	$csv = fgetcsv($f);
	fclose($f);
	return $csv;
}

function setDirChanged(){

	$f = fopen("stored_md5.txt", 'r');
	$old = fgets($f); // get old md5 from file
	fclose($f);

	// get md5 of directory
	$hash = hashDirectory(dirname(__FILE__) . SET_PATH);
	// Check whether dir has changed
	if ($hash !== $old) {
		// Store new hash
		file_put_contents("stored_md5.txt", $hash);
		return true;
	}
	return false;


}

function getIndex() {
	if (file_exists("set_index.json")) {
		$json = json_decode(file_get_contents("set_index.json"));
		return $json;
	}
	else {
		writeIndex();
		getIndex();
	}
}


// get md5 for directory
function hashDirectory($directory)
{
    if (! is_dir($directory))
    {
    	echo "no dir" . $directory;
        return false;
    }
 
    $files = array();
    $dir = dir($directory);
 
    while (false !== ($file = $dir->read()))
    {
        if ($file != '.' and $file != '..')
        {
            $files[] = md5_file($directory . '/' . $file);
        }
    }
 
    $dir->close();
 
    return md5(implode('', $files));
}



function writeIndex()
{
	$sets = array();

	foreach (new DirectoryIterator( dirname(__FILE__) . SET_PATH . "/") as $fileInfo) {
	    if($fileInfo->isDot()) continue;
	    if(!($fileInfo->isFile())) continue;
	    $meta = readSetMeta(dirname(__FILE__) . SET_PATH . "/" . $fileInfo->getFilename());
	    $content = array('f' => $fileInfo->getFilename(), 'n' => $meta[0], 'd' => $meta[1], 'a' => $meta[2]);
	    array_push($sets, $content);
	}
	// Write to file
	file_put_contents("set_index.json", json_encode($sets));
}


?>