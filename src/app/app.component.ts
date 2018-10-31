import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import { Subject } from 'rxjs/Subject';
import {
  map
} from 'rxjs/operators/map';
declare var Ionic:any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  photoChangedUrl = [];
  photoNativeUrl = [];
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private transfer: FileTransfer, private file: File,
    private imagePicker: ImagePicker
    ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  choose() {
    this.imagePicker.getPictures({
      maximumImagesCount: 1
    }).then((results) => {
      this.photoNativeUrl = this.photoNativeUrl.concat(results);
      this.photoChangedUrl = [];
      this.photoNativeUrl.forEach( (value, key) => {
        this.photoChangedUrl.push((Ionic as any).WebView.convertFileSrc(value));
      });
    }, (err) => { });
  }

  submit() {

    var temp$ = [];

    for (var i = 0; i < this.photoNativeUrl.length; i++) {
      temp$.push(this.uploadImageServer(this.photoNativeUrl[i], 'pic1'));
    }
  }
  fileName(imgUrl) {
    return imgUrl.substr(imgUrl.lastIndexOf('/') + 1);
  };
  uploadImageServer(filePath, fileKey) {
    var _this = this;
    var fileTransfer = this.transfer.create();
    var _upload$ = new Subject();

    var options = {
      fileKey: fileKey,
      fileName: _this.fileName(filePath),
      params: {
      }
    };
    fileTransfer.upload(filePath, 'url', options).then((res) => {
      _upload$.next(res);
    }).then(error => {
      _upload$.next(null);
    });
    return _upload$;
  };
 
  upload() {
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
       fileKey: 'file',
       fileName: 'name.jpg',
       headers: {}
    }
  
    fileTransfer.upload('<file path>', '<api endpoint>', options)
     .then((data) => {
       // success
     }, (err) => {
       // error
     })
  }
  
  download() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = 'http://www.example.com/file.pdf';
    fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      // handle error
    });
  }
}
