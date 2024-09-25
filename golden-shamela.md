- https: //api.goldenshamela.com/api/guest/categorytree

```json
{
  "success": true,
  "data": [
    {
      "categoryid": 92,
      "categoryname": "التفاسير",
      "status": true,
      "translate": {
        "categorynametrans": {
          "ar": "التفاسير",
          "en": "التفاسير",
          "fa": "tfaseer"
        }
      },
      "books_count": 770,
      "children": [
        {
          "categoryid": 9,
          "categoryname": "التفاسيرعربي",
          "status": true,
          "translate": {
            "categorynametrans": {
              "ar": "التفاسير",
              "en": "tfseer",
              "fa": "سليسش"
            }
          },
          "books_count": 731,
          "children": [],
          "parent_id": 92,
          "parent_name": "التفاسير"
        }
      ]
    }
  ]
}
```

- https://api.goldenshamela.com/api/guest/book?filter[categories.categoryid]=92&page=1

```json
{
  "data": [
    {
      "bookid": 1926,
      "bookname": "(جامع المواعظ والرقائق فيما حوته كتب ابن الجوزي من فوائد ورقائق)",
      "counterview": 6625,
      "counterdownload": 0,
      "publisheryear": null
    },
    {
      "bookid": 30065,
      "bookname": "{تفسير القرآن المجيد من الكتاب والسنة المطهرة} تفسير جزء الأحقاف",
      "counterview": 1777,
      "counterdownload": 0,
      "publisheryear": null
    },
    {
      "bookid": 1927,
      "bookname": "50 فائدة وقاعدة",
      "counterview": 2504,
      "counterdownload": 0,
      "publisheryear": null
    }
  ]
}
```

- https://api.goldenshamela.com/api/guest/book/1926

```json
{
  "success": true,
  "data": {
    "bookid": 1926,
    "bookname": "(جامع المواعظ والرقائق فيما حوته كتب ابن الجوزي من فوائد ورقائق)",
    "counterview": 6628,
    "counterdownload": 0,
    "bookdsecription": "المؤلف: جمال الدين أبو الفرج عبد الرحمن بن علي بن محمد الجوزي (المتوفى: 597 هـ)\nجمع وترتيب/ العاجز الفقير: عبد الرحمن القماش\n(من علماء الأزهر الشريف)\n[الكتاب مرقم آليا، وهو غير مطبوع]\nالمصدر: الشاملة الذهبية",
    "isdownloadable": true,
    "booklink": null,
    "lang": {
      "langid": 1,
      "langname": "العربية",
      "langcode": "ar"
    },
    "categories": [
      {
        "categoryid": 9,
        "categoryname": "التفاسيرعربي",
        "translate": {
          "categorynametrans": {
            "ar": "التفاسير",
            "en": "tfseer",
            "fa": "سليسش"
          }
        }
      }
    ],
    "author": [
      {
        "authorid": 608,
        "authorname": "ابن الجوزي"
      }
    ],
    "publisher": [
      {
        "publisherid": 4,
        "publishername": "www.goldenshamela.com",
        "publisheryear": 597
      }
    ],
    "metainfo": [
      {
        "id": 231543,
        "meta_name": "title",
        "meta_value": "(جامع المواعظ والرقائق فيما حوته كتب ابن الجوزي من فوائد ورقائق)"
      },
      {
        "id": 231544,
        "meta_name": "creator",
        "meta_value": "ابن الجوزي"
      },
      {
        "id": 231545,
        "meta_name": "contributor",
        "meta_value": "calibre (5.14.0) [https://calibre-ebook.com]"
      },
      {
        "id": 231546,
        "meta_name": "publisher",
        "meta_value": "www.goldenshamela.com"
      },
      {
        "id": 231547,
        "meta_name": "identifier",
        "meta_value": "16597930-d46b-4773-8199-74a390ca9b6e"
      },
      {
        "id": 231548,
        "meta_name": "identifier",
        "meta_value": "16597930-d46b-4773-8199-74a390ca9b6e"
      },
      {
        "id": 231549,
        "meta_name": "date",
        "meta_value": "0101-01-01T00:00:00+00:00"
      },
      {
        "id": 231550,
        "meta_name": "language",
        "meta_value": "ar"
      }
    ],
    "fileurl": "https://api.goldenshamela.com//storage/attachment/NTuWPqzILsV8Q2Jq7OCNBb3yjomDNQva499jdkEd.epub",
    "cover": null
  }
}
```
