#!/usr/local/bin/php

<?php
echo
'<html>
	<head>
		<title>Generic Form Complete</title>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
	</head>
		
	<body>';

		if($_GET)
		{			
			$array = $_GET;
			$filename = $_GET['filename'];
		}
		else if($_POST)
		{
			$array = $_POST;
			$filename = $_POST['filename'];
		}
		else
		{
			echo 'You do not have access to this file. Please return to <a href="http://bin.yale.edu/~jwk28">Home</a></body>';	// If someone accesses the file directly, it wont work :)
		}

		if (!$filename)  //if no file name sent, then set to default
		{
			$filename = "default.xls";
		}
		else if (!stristr($filename, ".xls"))  //add .xls extension if necessary
		{
			$filename .= ".xls";
		}

		$filename = "../data/" . $filename;

		$lbChar = " ";	//linebreak replacement
		$tab = "\t";	//chr(9);
		$cr = "\n";		//chr(13);

		if ($array)
		{
			$header = 'date' . $tab;
			$data = date('M j, y g:i:s A') . $tab;
			$keys = array_keys($array);
	
			foreach ($keys as $key)
			{
				if ($key != 'filename' && $key != 'mailcontact'
					&& $key != 'mailsubject' && $key != 'homepage'
					&& $key != 'Submit')
				{
					$header .= $key . $tab;
			
					$array[$key] = str_replace("\n",$lbChar,$array[$key]);  //substitute newlines for spaces
					$array[$key] = preg_replace('/([\r\n])/e',"ord('$1')==10?'':''",$array[$key]);  //substitute html characters
			
					$data .= $array[$key] . $tab;
					
				}
			}
	
			$header .= $cr;
			$data .= $cr;
	
			if (!file_exists($filename))
			{
				$data = $header . $data;
			}

			$fout = fopen($filename, "a");

			if ($fout)
			{
				fwrite($fout, $data);
				fclose($fout);
		
				mail($array['mailcontact'],$array['mailsubject'], filename,"Form edited.  Get the form here http://bin.yale.edu/~jwk28/data/" . basename($filename));
				echo '<p><strong>Thanks!</strong></p>
					  <p>Form Received Successfully!<p>';
			}
			else
			{
				echo '<p><strong>Sorry</strong></p>
					  <p>Error receiving form</p>';
			}
		}
	
		echo '<p>Return <a href=' . $array['homepage'] . '>Home</a></p>
	</body>
</html>';

?>

